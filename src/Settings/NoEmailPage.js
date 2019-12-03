import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    ImageBackground,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'
import Toast, {DURATION} from 'react-native-easy-toast'
import Button from 'apsl-react-native-button'
import * as Util from '../Helper/Util'
import { Navigation } from 'react-native-navigation'

import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'
import * as Configuration from '../constants/configuration'

import firebase from 'react-native-firebase';

export default class NoEmailPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            user: '',
            address: '',
            isProgressVisible: false,
        }
    }

    showProgress = () => this.setState({ isProgressVisible: true })    
    hideProgress = () => this.setState({ isProgressVisible: false })

    userChanged = (e) => {
        this.setState({
            user: e.nativeEvent.text
        })
    }

    addressChanged = (e) => {
        this.setState({
            address: e.nativeEvent.text
        })
    }

    sendSuccess = (res) => {
        
        console.log('server --> client(send pdf success): ', res.data)

        if (res.data.result == Api.OK) {
            this.hideProgress()

            this.props.navigator.push({
                screen: 'Utils.SuccessPage',
                passProps: {
                    message: 'Your e-waiver has been sent to the email provided in your profile page.',
                    popNum: 4
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
        if (this.state.user == '' || this.state.address == '') {
            this.refs.toast.show('Email is empty.');
        } else {
            var email = this.state.user + '@' + this.state.address
            if (!Util.validateEmail(email)) {
                this.refs.toast.show('Please verify your email address')
                return
            }

            this.showProgress()

            var param = {
                user_id: this.props.userId,
                user_token: this.props.token,
                email
            }

            console.log('client --> server(send pdf): ', param)
            CIMAService.sendPostRequestAsync( Api.SENDPDF, param, this.sendSuccess, this.sendFailed )
        }
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={ [Styles.innerContainer, Styles.normalPadding, style.container] } >
                        {/* content */}
                        <View style={[style.contentContainer]}>
                            {/* space */}
                            <View style={ [Styles.superLargeSpace] } />

                            <View style={ {alignSelf: 'stretch'} }>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.textAlignLeft] }>No e-mail provided in your profile page. Please provide your email address.</Text>
                            </View>

                            {/* space */}
                            <View style={ [Styles.middleSpace] } />

                            {/* email container */}
                            <View style={ style.emailContainer }>
                                <TextInput 
                                    style={ [Styles.stretch2X, Styles.grayBorder, Styles.verySmallPadding, Styles.lightGrayColor, Styles.smallFont] }
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    onChange={this.userChanged}
                                    value={this.state.user}
                                    autoCapitalize = "none"
                                />

                                <Text style={[style.attText, Styles.lightGrayColor, Styles.middleFont]}>@</Text>

                                <TextInput 
                                    style={[Styles.stretch3X, Styles.grayBorder, Styles.verySmallPadding, Styles.lightGrayColor, Styles.smallFont]}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    onChange={this.addressChanged}
                                    value={this.state.address}
                                    autoCapitalize = "none"
                                />
                            </View>
                        </View>

                        {/* send button */}
                        <Button
                            textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                            style={[Styles.activeButton,]}
                            activeOpacity={0.5}
                            onPress={() => this.sendEmail()} >
                            SEND
                        </Button>

                        {/* progress dialog */}
                        <Modal isVisible={this.state.isProgressVisible}>
                            <View style={ [Styles.centerInColumn, ] }>
                                <ProgressBar />
                            </View>
                        </Modal>

                        <Toast ref="toast"/>
                        
                    </View>
                </TouchableWithoutFeedback>
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
    emailContainer: {
        height: moderateScale(30),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    attText: {
        paddingLeft: moderateScale(10),
        paddingRight: moderateScale(10)
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center'
    }
})

NoEmailPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};