import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    Text,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import dateFormat from 'dateformat'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'
import Toast, {DURATION} from 'react-native-easy-toast'
import { Navigation } from 'react-native-navigation'

import * as Configuration from '../constants/configuration'
import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'
import * as Util from '../Helper/Util'
import * as Storage from '../Helper/Storage'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import firebase from 'react-native-firebase';

class PassInOutPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            message: '',
            checkInOut: 'Check-in now?',
            baseUrl: '',
            userId: '',
            userToken: '',
            isProgressVisible: false,
        }

        this.pass = null
    }

    showProgress = () => this.setState({ isProgressVisible: true })    
    hideProgress = () => this.setState({ isProgressVisible: false })

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.userToken = await Storage.getToken()
        this.passesInfo = JSON.parse( await Storage.getPasses() )

        this.showProgress()

        var param = {
            user_id: this.userId,
            user_token: this.userToken,
            pass_type: this.props.pass.type,
            timestamp: new Date().getTime()
        }

        console.log('client --> server: ', param)

        CIMAService.sendPostRequestAsync( Api.VALIDATE_PASS, param, this.validateSuccess, this.validateFailed)
    }

    validateSuccess = (res) => {

        console.log('server --> client(pass validation success): ', res.data)

        if (res.data.result === Api.OK) {
            this.hideProgress()

            switch (res.data.detail.type) {
                case Api.PROMOPASS_TYPE: 
                    this.setState({
                        message: 'You have ONE PROMO PASS available',
                        checkInOut: 'Check-in now?'
                    })
                    break;
                case Api.MULTIPASS_TYPE: 
                    this.setState({
                        message: 'You have ' + res.data.detail.quantity + ' MULTI ' + (res.data.detail.quantity > 1? 'PASSES':'PASS') + ' which expires on ' + dateFormat(new Date(res.data.detail.to), "dd mmm yyyy"),
                        checkInOut: 'Check-in now?'
                    })
                    break;
                case Api.DAYPASS_TYPE: 
                    this.setState({
                        message: 'You have ' + res.data.detail.quantity + ' DAY ' + (res.data.detail.quantity > 1? 'PASSES':'PASS') + ' which expires on ' + dateFormat(new Date(res.data.detail.to), "dd mmm yyyy"),
                        checkInOut: 'Check-in now?'
                    })
                    break;
                case Api.SEASONPASS_TYPE: 
                    this.setState({
                        message: 'You have a SEASON PASS started since ' + dateFormat(new Date(res.data.detail.from), "dd mmm yyyy"),
                        checkInOut: 'Check-in now?'
                    })
                    break;
            }

            this.pass = {
                type: res.data.detail.type,
                from: res.data.detail.from,
                to: res.data.detail.to,
                available: true,
                used: res.data.detail.used,
                quantity: res.data.detail.quantity
            }

            // update pass in storage
            index = Util.getIndex( res.data.detail.type, this.passesInfo, 'type' )
            if (index > -1) {
                var action = {
                    index,                
                    item: {
                        ...this.pass
                    }
                }
    
                this.passesInfo = Util.updateObjectInArray(this.passesInfo, action)
                Storage.setPasses( JSON.stringify(this.passesInfo) )
            }
    
            this.setState({
                baseUrl: res.data.detail.used? Api.GYMOUT : Api.GYMIN,
                userId: this.userId,
                userToken: this.userToken
            })
        } else if (res.data.result === Api.FAILED) {
            this.hideProgress()
            
            this.refs.toast.show( 'The pass is not valid.' );

            if (res.data.detail.type == Api.SEASONPASS_TYPE && res.data.detail.quantity > 0) {
                // var passInfo = {
                //     type: res.data.detail.type,
                //     from: res.data.detail.from,
                //     to: res.data.detail.to,
                //     available: true,
                //     used: res.data.detail.used,
                //     quantity: res.data.detail.quantity
                // }

                // this.props.actions.seasonPassChanged( passInfo )

                this.setState({
                    message: 'The pass will be available from ' + dateFormat(new Date(res.data.detail.from), "dd mmm yyyy"),
                })
                return
            }

            var passInfo = {
                type: this.props.pass.type,
                from: this.props.pass.from,
                to: this.props.pass.to,
                available: false,
                used: false,
                quantity: 0
            }

            switch (this.props.pass.type) {
                case Api.SEASONPASS_TYPE: 
                    this.props.actions.seasonPassChanged( passInfo )
                    break;
                case Api.MULTIPASS_TYPE: 
                    this.props.actions.multiPassChanged( passInfo )
                    break;
                case Api.DAYPASS_TYPE: 
                    this.props.actions.dayPassChanged( passInfo )
                    break;
                case Api.PROMOPASS_TYPE: 
                    this.props.actions.promoPassChanged( passInfo )
                    break;
            }

            // delete the pass in storage
            index = Util.getIndex( this.props.pass.type, this.passesInfo, 'type' )
            if (index > -1) {
                var action = {
                    index,
                }
    
                this.passesInfo = Util.removeItem(this.passesInfo, action)
                Storage.setPasses( JSON.stringify(this.passesInfo) )
            }

            // this.props.navigator.pop();
            this.setState({
                message: 'No available pass. Please try with another one',
            })
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

    validateFailed = (err) => {
        this.hideProgress()

        console.log('server --> client(pass validation failed): ', err)

        this.refs.toast.show( 'Opps there has been some issue with our server, please try again later.' );
    }

    goQRCodePage() {
        if ( this.pass == null ) {
            this.refs.toast.show( 'The pass is not valid.' );
            return
        }

        this.props.navigator.push({
            screen: 'Passes.QRCodePage',
            passProps: {
                baseUrl: this.state.baseUrl,
                userId: this.state.userId,
                pass: this.pass,
                userToken: this.state.userToken,
                popNum: 2
            }
        });
    }

    goBack() {
        this.props.navigator.pop();
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, Styles.largePaddingTop, style.container, Styles.smallPadding] } >
                    {/* space */}
                    <View style={ [Styles.middleSpace] } />

                    <View >
                        <Text style={ [Styles.lightGrayColor, Styles.largeFont, Styles.textAlignCenter] }>{this.state.message}</Text>
                    </View>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    <View >
                        <Text style={ [Styles.lightGreenColor, Styles.largeFont, Styles.textAlignCenter] }>{this.state.checkInOut}</Text>
                    </View>

                    {/* space */}
                    <View style={ [Styles.superLargeSpace] } />

                    {/* yes & no button */}
                    <View style={style.buttonContainer}>
                        {/* yes button */}
                        <Button
                            textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                            style={[Styles.stretch, style.button]}
                            activeOpacity={0.5}
                            onPress={() => this.goQRCodePage()} >
                            YES
                        </Button>

                        {/* no button */}
                        <Button
                            textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                            style={[Styles.stretch, style.button]}
                            activeOpacity={0.5}
                            onPress={() => this.goBack()} >
                            NO
                        </Button>
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
    button: {
        backgroundColor: '#5EC3AE',
        borderColor: '#5EC3AE',
        height: moderateScale(100),
        marginBottom: 0,
        marginLeft: moderateScale(20),
        marginRight: moderateScale(20)
    },
    buttonContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    }
})

PassInOutPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

PassInOutPage.propTypes = {
	actions: PropTypes.object.isRequired,
    promoPassInfo: PropTypes.object,
    multiPassInfo: PropTypes.object,
    seasonPassInfo: PropTypes.object,
    dayPassInfo: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
    return {
        promoPassInfo: state.cima.promoPassInfo,
        multiPassInfo: state.cima.multiPassInfo,
        seasonPassInfo: state.cima.seasonPassInfo,
        dayPassInfo: state.cima.dayPassInfo,
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PassInOutPage);