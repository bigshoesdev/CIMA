import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ImageBackground,
    WebView,
    Dimensions,    
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import { Navigation } from 'react-native-navigation'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'
import Toast, {DURATION} from 'react-native-easy-toast'

import * as cimaActions from '../actions/cima.action'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as types from '../constants/actionTypes'
import * as Storage from '../Helper/Storage'

import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'
import * as Configuration from '../constants/configuration'

import Pdf from 'react-native-pdf';

import firebase from 'react-native-firebase';

class ViewIndemnityPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            userId: '',
            token: '',
            email: '',
            isProgressVisible: false,
        }
    }

    async componentDidMount() {
        this.setState({
            userId: await Storage.getUserID(),
            token: await Storage.getToken(),
            email: await Storage.getEmail()
        })

        this.props.actions.pdfUrlChanged( await Storage.getPDFUrl() )
    }

    showProgress = () => this.setState({ isProgressVisible: true })    
    hideProgress = () => this.setState({ isProgressVisible: false })

    sendSuccess = (res) => {
        
        console.log('server --> client(send pdf success): ', res.data)

        if (res.data.result == Api.OK) {
            this.hideProgress()

            this.props.navigator.push({
                screen: 'Utils.SuccessPage',
                passProps: {
                    message: 'Your e-waiver has been sent to the email provided in your profile page.',
                    popNum: 3
                }
            });
        } else if (res.data.result == Api.FAILED) {
            this.hideProgress()
            
            this.refs.toast.show('Service Error');
        } else {
            Storage.setToken( '' )

            if (Platform.OS === "android") {
                this.hideProgress()
            }

            // firebase.auth().signOut();
            
            Navigation.startSingleScreenApp({
                screen: {
                    screen: 'Registration.PhonenumberPage',
                },
                appStyle: {
                    orientation: 'portrait',
                },
            });
        }
    }

    sendFailed = (err) => {
        this.hideProgress()
        console.log('server --> client(send pdf error): ', err)

        this.refs.toast.show('Opps there has been some issue with our server, please try again later.');
    }

    sendEmail() {
        if (this.state.email == '') {
            this.props.navigator.push({
                screen: 'Settings.NoEmailPage',
                passProps: {
                    userId: this.state.userId,
                    token: this.state.token,
                    email: this.state.email
                }
            });
        } else {
            this.showProgress()

            var param = {
                user_id: this.state.userId,
                user_token: this.state.token,
                email: this.state.email
            }

            console.log('client --> server(send pdf): ', param)
            CIMAService.sendPostRequestAsync( Api.SENDPDF, param, this.sendSuccess, this.sendFailed )
        }
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

        const { 
            pdfUrl,
        } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.smallPadding] } >
                    <View >
                        <Text style={ [Styles.lightGrayColor, Styles.normalPaddingTop, Styles.largeFont, Styles.textAlignCenter] }>INDEMNITY</Text>
                    </View>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* Send email*/}
                    <View style={style.sendEmailContainer}>
                        <TouchableOpacity style={{flex: 1}} key={1} onPress={() => this.sendEmail() }>
                            <Text style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch, Styles.textAlignRight] }>Send to my email</Text>
                        </TouchableOpacity>
                    </View>

                    {/* PDF view */}
                    <View style={[style.pdfContainer]}>
                        <Pdf
                            source={{uri:pdfUrl, cache:true}}
                            onLoadComplete={(pageCount,filePath)=>{
                                console.log(`total page count: ${pageCount}`);
                            }}
                            onPageChanged={(page,pageCount)=>{
                                console.log(`current page: ${page}`);
                            }}
                            onError={(error)=>{
                                console.log(error);
                            }}
                            style={style.pdf}/>
                    </View>

                    {/* progress dialog */}
                    <Modal isVisible={this.state.isProgressVisible}>
                        <View style={ [Styles.centerInColumn, ] }>
                            <ProgressBar />
                        </View>
                    </Modal>

                    <Toast ref="toast"/>
                </View>
            </ImageBackground>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center'
    },
    recordColor: {
        color: '#0D4C6B'
    },
    sendEmailContainer: {
        alignSelf: 'stretch',
        height: moderateScale(30)
    },
    pdfContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    pdf: {
        flex:1,        
        alignSelf: 'stretch'
    }
})

ViewIndemnityPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

ViewIndemnityPage.propTypes = {
    actions: PropTypes.object.isRequired,
	pdfUrl: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        pdfUrl: state.cima.pdfUrl,
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewIndemnityPage);