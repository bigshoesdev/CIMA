import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    Text,
    TextInput,
    BackHandler,
    TouchableOpacity,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import QRCode from 'react-native-qrcode'
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

class QRCodePage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            shortenerId: 0,
            isOnScanning: false,
            message: '',
            submessage: '',
        }

        this.baseUrl = ''
        this.scanningTimer = -1
        this.passesInfo = []
    }

    async componentWillMount() {
        this.passesInfo = JSON.parse( await Storage.getPasses() )
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPress)
        
        today = new Date()
        // today.setDate( today.getDate() - 5 )

        var param = {
            user_id: this.props.userId,
            timestamp: today.getTime(),
            pass_type: this.props.pass.type,
            user_token: this.props.userToken
        }

        this.baseUrl = this.props.baseUrl

        if (this.props.baseUrl == Api.GYMIN) {
            console.log('client --> server(create check-in shortener ID): ', param)
            this.setState({
                message: 'Woohoo! You have successfully checked in.',
                submessage: 'ENJOY YOUR CLIMB!'
            })
        } else {
            console.log('client --> server(create check-out shortener ID): ', param)
            this.setState({
                message: 'Thank you for checking in. Please use this QR code to check out, or for re-entry.',
                submessage: ''
            })
        }
        
        CIMAService.sendPostRequestAsync( this.baseUrl, param, this.shortenerIdCreationSuccess, this.shortenerIdCreationFailed)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPress)
        clearInterval( this.scanningTimer )
    }

    backPress = () => true

    createCheckoutShortenerId = () => {
        this.setState({
            message: 'Thank you for checking in. Please use this QR code to check out, or for re-entry.',
            submessage: ''
        })

        today = new Date()
        // today.setDate( today.getDate() - 5 )

        var param = {
            user_id: this.props.userId,
            timestamp: today.getTime(),
            pass_type: this.props.pass.type,
            user_token: this.props.userToken
        }

        this.baseUrl = Api.GYMOUT

        console.log('client --> server(create check-out shortener ID): ', param)

        CIMAService.sendPostRequestAsync( this.baseUrl, param, this.shortenerIdCreationSuccess, this.shortenerIdCreationFailed)
    }

    updatePassInfo = ( used ) => {
        var quantity = this.props.pass.quantity

        // if (!used) {
        //     // update pass button in home page
        //     switch (this.props.pass.type) {
        //         case Api.MULTIPASS_TYPE: 
        //             quantity--
        //             break;
        //         case Api.PROMOPASS_TYPE: 
        //             quantity--
        //             break;
        //     }
        // }

        // update storage
        var passInfo = {
            type: this.props.pass.type,
            from: this.props.pass.from,
            to: this.props.pass.to,
            available: quantity > 0,
            used,
            quantity
        }

        index = Util.getIndex( this.props.pass.type, this.passesInfo, 'type' )
        if (quantity <= 0) {
            var action = {
                index
            }

            this.passesInfo = Util.removeItem(this.passesInfo, action)
            
        } else {
            var action = {
                index,                
                item: {
                    ...passInfo
                }
            }

            this.passesInfo = Util.updateObjectInArray(this.passesInfo, action)
        }
        Storage.setPasses( JSON.stringify(this.passesInfo) )

        // update pass button in home page
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
    }

    scanSuccess = (res) => {
        if (this.baseUrl == Api.GYMIN) {
            console.log('server --> client(check in scanning success): ', res.data)
        } else {
            console.log('server --> client(check out scanning success): ', res.data)
        }

        this.setState({
            isOnScanning: false
        })

        if (res.data.result === Api.OK) {
            // cancel scanning
            clearInterval( this.scanningTimer )

            if (this.baseUrl == Api.GYMIN) {
                // successful check it
                // make the pass as used
                this.updatePassInfo( true )

                // now creating a check out QR code
                this.createCheckoutShortenerId()
            } else {
                // successful check out
                // make the pass as used
                this.updatePassInfo( false )

                // finish QR code scanning
                this.goAfterScanoutPage()
            }
        } else if (res.data.result === Api.FAILED) {
            // this.refs.toast.show( 'Service Error' );
        } else {
            Storage.setToken( '' )

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

    scanFailed = (err) => {
        if (this.baseUrl == Api.GYMIN) {
            console.log('server --> client(check in scanning failed): ', err)
        } else {
            console.log('server --> client(check out scanning failed): ', err)
        }

        this.refs.toast.show( 'QR code scan failed' );

        this.setState({
            isOnScanning: false
        })
    }

    scanQRCode = () => {
        if ( this.state.isOnScanning ) {
            return
        }

        this.setState({
            isOnScanning: true
        })

        today = new Date()
        // today.setDate( today.getDate() - 5 )

        var param = {
            user_id: this.props.userId,
            pass_type: this.props.pass.type,
            status: this.baseUrl == Api.GYMIN? 'in':'out',
            user_token: this.props.userToken,
            timestamp: today.getTime()
        }

        if (this.baseUrl == Api.GYMIN) {
            console.log('client --> server(scan check-in QR code): ', param)
        } else {
            console.log('client --> server(scan check-out QR code): ', param)
        }

        CIMAService.sendPostRequestAsync( Api.SCANQRCODE, param, this.scanSuccess, this.scanFailed)
    }

    shortenerIdCreationSuccess = ( res ) => {
        if (this.baseUrl == Api.GYMIN) {
            console.log( 'server --> client(check-in shortener ID creation success): ', res.data )
        } else {
            console.log( 'server --> client(check-out shortener ID creation success): ', res.data )
        }
        if (res.data.result === Api.OK) {
            this.setState({
                shortenerId: res.data.decimalcode
            })

            this.scanningTimer = setInterval(this.scanQRCode, 2000)
        } else if (res.data.result === Api.FAILED) {
            this.refs.toast.show( 'Service Error' );
        } else {
            Storage.setToken( '' )

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

    shortenerIdCreationFailed = ( err ) => {
        if (this.baseUrl == Api.GYMIN) {
            console.log( 'server --> client(check-in shortener ID creation failed): ', err )
        } else {
            console.log( 'server --> client(check-in shortener ID creation failed): ', err )
        }

        this.refs.toast.show( 'Generating QR code failed' );
    }

    validateSuccess = (res) => {
        if (res.data.result === Api.OK) {
            if (this.baseUrl == Api.GYMIN) {
                console.log('server --> client(check-in QR code validation success): ', res.data)
    
                console.log( ' ' )
                console.log( 'mam ---> GYM' )
                console.log( ' ' )
            } else {
                console.log('server --> client(check-out QR code validation success): ', res.data)
    
                console.log( ' ' )
                console.log( 'GYM <--- man' )
                console.log( ' ' )
            }
        } else {
            console.log('server --> client(No available QR code): ', res.data)
        }                 
    }

    validateFailed = (err) => {
        if (this.baseUrl == Api.GYMIN) {
            console.log('server --> client(check-in QR code validation failed): ', err)

            console.log( ' ' )
            console.log( 'mam -x-> GYM' )
            console.log( ' ' )
        } else {
            console.log('server --> client(check-out QR code validation failed): ', err)

            console.log( ' ' )
            console.log( 'GYM <-x- man' )
            console.log( ' ' )
        }
    }

    validateQRCode = () => {
        if (Configuration.RELEASE_MODE) {
            return
        }

        var param = {
            hexcode: this.state.shortenerId.toString(16)
        }

        if (this.baseUrl == Api.GYMIN) {
            console.log('client --> server(validate check-in QR code): ', param)
        } else {
            console.log('client --> server(validate check-out QR code): ', param)
        }

        CIMAService.sendGetRequestAsync(Api.VALIDATEQRCODE, param, this.validateSuccess, this.validateFailed )
    }

    goHomePage = () => {
        for(var i = 0; i < this.props.popNum; i++) {
            this.props.navigator.pop( {animated: false,} );
        }
    }

    goAfterScanoutPage() {
        this.props.navigator.push({
            screen: 'Passes.AfterScanoutPage',
            passProps: {
                popNum: this.props.popNum + 1
            }
        });
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let qrImage = require('../assets/images/qr.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, Styles.normalPadding, style.container] } >
                    {/* content */}
                    <View style={style.contentContainer}>
                        <View >
                            <Text style={ [Styles.lightGrayColor, Styles.largeFont, Styles.textAlignCenter] }>{this.state.message}</Text>
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        <View >
                            <Text style={ [Styles.lightGreenColor, Styles.largeFont, Styles.textAlignCenter] }>{this.state.submessage}</Text>
                        </View>

                        {/* space */}
                        <View style={ [Styles.superLargeSpace] } />

                        {/* QR Code */}
                        <View style={[style.buttonContainer, this.state.shortenerId == 0? Styles.hidden : Styles.visible ]}>
                            {/* yes button */}
                            <TouchableOpacity key={1} onPress={() => this.validateQRCode() }>
                                <QRCode
                                    value={this.state.shortenerId.toString()}
                                    size={moderateScale(150)}
                                    bgColor='black'
                                    fgColor='white'                                    
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* home button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton,]}
                        activeOpacity={0.5}
                        onPress={() => this.goHomePage() } >
                        HOME
                    </Button>

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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch'
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
    },
    qrImage: {
        height: moderateScale(150),
        width: moderateScale(150)
    },
})

QRCodePage.navigatorStyle = {
    navBarHidden: true,
    disabledBackGesture: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

QRCodePage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(QRCodePage);