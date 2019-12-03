import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    ImageBackground,
    Text,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import * as Storage from '../Helper/Storage'
import { Navigation } from 'react-native-navigation'

import firebase from 'react-native-firebase';

export default class SettingsPage extends Component {
	constructor(props) {
        super(props);

        this.goPersonalInfoPage = this.goPersonalInfoPage.bind(this)
        this.goRecordPage = this.goRecordPage.bind(this)
        this.goIndemnityPage = this.goIndemnityPage.bind(this)
        this.goTermsAndConditionsPage = this.goTermsAndConditionsPage.bind(this)
        this.goFeedbackPage = this.goFeedbackPage.bind(this)
    }

    goPersonalInfoPage() {
        this.props.navigator.push({
            screen: 'Settings.PersonalInfoPage'
        });
    }

    goRecordPage() {
        this.props.navigator.push({
            screen: 'Settings.RecordPage'
        });
    }

    goIndemnityPage() {
        this.props.navigator.push({
            screen: 'Settings.ViewIndemnityPage'
        });
    }

    goTermsAndConditionsPage() {
        this.props.navigator.push({
            screen: 'Settings.TermsAndConditionsPage'
        });
    }

    goFeedbackPage() {
        this.props.navigator.push({
            screen: 'Settings.FeedbackPage'
        });
    }

    logOut() {
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

	render() {
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, Styles.normalPadding, style.container] } >
                    <View >
                        <Text style={ [Styles.lightGrayColor, Styles.largeFont, Styles.textAlignCenter] }>SETTINGS</Text>
                    </View>

                    {/* space */}
                    <View style={ [Styles.middleSpace] } />

                    {/* button related to setting */}
                    <Button
                        textStyle={ [Styles.middleFont, Styles.whiteColor] }                    
                        style={[ style.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.goPersonalInfoPage()} >
                        PERSONAL INFO
                    </Button>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    <Button
                        textStyle={ [Styles.middleFont, Styles.whiteColor] }                    
                        style={[ style.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.goRecordPage()} >
                        RECORDS
                    </Button>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    <Button
                        textStyle={ [Styles.middleFont, Styles.whiteColor] }                    
                        style={[ style.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.goIndemnityPage()} >
                        VIEW INDEMNITY
                    </Button>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    <Button
                        textStyle={ [Styles.middleFont, Styles.whiteColor] }                    
                        style={[ style.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.goTermsAndConditionsPage()} >
                        TERMS & CONDITIONS
                    </Button>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    <Button
                        textStyle={ [Styles.middleFont, Styles.whiteColor] }                    
                        style={[ style.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.goFeedbackPage()} >
                        FEEDBACK
                    </Button>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    <Button
                        textStyle={ [Styles.middleFont, Styles.whiteColor] }                    
                        style={[ style.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.logOut()} >
                        LOG OUT
                    </Button>
                    
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
    inactiveButton: {
        backgroundColor: '#d8d8d8',
        borderColor: '#d8d8d8',
        height: moderateScale(40),
        marginBottom: 0,
        marginLeft: moderateScale(20),
        marginRight: moderateScale(20)
    },
    activeButton: {
        backgroundColor: '#5EC3AE',
        borderColor: '#5EC3AE',
        height: moderateScale(40),
        marginBottom: 0,
        marginLeft: moderateScale(20),
        marginRight: moderateScale(20)
    },
})

SettingsPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

