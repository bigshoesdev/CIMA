import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ImageBackground,
    ScrollView,
    TextInput,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import { Navigation } from 'react-native-navigation'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'
import Toast, {DURATION} from 'react-native-easy-toast'

import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'
import * as Configuration from '../constants/configuration'
import * as Storage from '../Helper/Storage'

import firebase from 'react-native-firebase';

export default class FeedbackPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            userId: '',
            token: '',
            title: '',
            feedback: '',
            isProgressVisible: false
        }

        this.sendFeedback = this.sendFeedback.bind(this)
    }

    async componentDidMount() {
        this.setState({
            userId: await Storage.getUserID(),
            token: await Storage.getToken()
        })
    }

    showProgress = () => this.setState({ isProgressVisible: true })    
    hideProgress = () => this.setState({ isProgressVisible: false })

    titleChanged = (e) => {
        this.setState({
            title: e.nativeEvent.text
        })
    }

    feedbackChanged = (e) => {
        this.setState({
            feedback: e.nativeEvent.text
        })
    }

    sendSuccess = (res) => {
        
        console.log('server --> client(send feedback success): ', res.data)

        if (res.data.result == Api.OK) {
            this.hideProgress()

            this.props.navigator.push({
                screen: 'Utils.SuccessPage',
                passProps: {
                    message: 'Your feedback or suggestion is highly valuable and appreciated. If the nature of your feedback is a query, we will follow up with you as soon as possible. Have a good day!',
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
        console.log('server --> client(send feedback error): ', err)

        this.refs.toast.show('Opps there has been some issue with our server, please try again later.');
    }

    sendFeedback() {
        if (this.state.title == '') {
            this.refs.toast.show('Title is empty.');
            return
        }

        if (this.state.feedback == '') {
            this.refs.toast.show('Feedback is empty.');
            return
        }

        this.showProgress()

        var param = {
            user_id: this.state.userId,
            user_token: this.state.token,
            title: this.state.title,
            message: this.state.feedback
        }

        console.log('client --> server(send feedback): ', param)
        CIMAService.sendPostRequestAsync( Api.SENDFEEDBACK, param, this.sendSuccess, this.sendFailed )
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                        <View >
                            <Text style={ [Styles.lightGrayColor, Styles.largeFont, Styles.textAlignCenter] }>FEEDBACK</Text>
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        {/* Email */}
                        <View style={style.emailContainer}>
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont] }>Title:</Text>

                            {/* space */}
                            <View style={ [Styles.verySmallPadding] } />

                            <TextInput 
                                style={ [Styles.stretch, style.emailInput, Styles.lightGrayColor, Styles.middleFont] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                onChange={this.titleChanged}
                                value={this.state.title}
                            />
                        </View>

                        {/* space */}
                        <View style={ [Styles.smallPadding] } />

                        {/* Tell us */}
                        <View style={style.tellusContainer}>
                            <Text style={ [style.tellusText, Styles.lightGrayColor, Styles.middleFont] }>Tell us what you think!</Text>

                            {/* space */}
                            <View style={ [Styles.verySmallPadding] } />

                            <TextInput 
                                multiline={true} style={ [style.tellusText, Styles.verySmallPadding, Styles.stretch, Styles.grayBorder, Styles.lightGrayColor, Styles.smallFont] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                onChange={this.feedbackChanged}
                                value={this.state.feedback}
                            />
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalPadding] } />

                        {/* Send button */}
                        <Button
                            textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                            style={[Styles.activeButton,]}
                            activeOpacity={0.5}
                            onPress={() => this.sendFeedback()} >
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
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderBottomWidth: moderateScale(1),
        borderColor: '#979797',
        height: moderateScale(40),
        alignItems: 'center'
    },
    emailInput: {
        height: moderateScale(40),
    },
    tellusContainer: {
        alignSelf: 'stretch', 
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',    
    },
    tellusText: {
        alignSelf: 'stretch',        
    },
})

FeedbackPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};