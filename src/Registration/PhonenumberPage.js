import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    ImageBackground,
    Image,
    Text,
    StyleSheet,
    View,
    Platform,
    DeviceEventEmitter,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';

import { Icon } from 'react-native-elements';
import Button from 'apsl-react-native-button'
import Toast, {DURATION} from 'react-native-easy-toast'

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import * as Api from '../constants/api'
import * as Util from '../Helper/Util'

// phone
import PhoneInput from 'react-native-phone-input'
import ModalPickerImage from '../ModalPickerImage'
import PhoneNumber from 'react-native-phone-input/lib/phoneNumber'

import * as Storage from '../Helper/Storage'
import stripe from 'tipsi-stripe'

stripe.init({
    publishableKey: 'pk_test_XKZpjGWsIcFoykT8ygLL44HQ',
    merchantId: '',
    androidPayMode: 'test',
})

export default class PhonenumberPage extends Component {
	constructor(props) {
        super(props);
        
        this.onPressFlag = this.onPressFlag.bind(this)
        this.selectCountry = this.selectCountry.bind(this)
        this.doContinue = this.doContinue.bind(this)
        this.clearPhonenumber = this.clearPhonenumber.bind(this)

        this.doPhoneAuth = this.doPhoneAuth.bind(this)

        this.state = {
            pickerData: null,
            country: null
        }
    }

    doPhoneAuth() {
        var phoneNumber = this.refs.phone.getValue()
    }

    async componentDidMount() {
        this.setState({
            pickerData: this.refs.phone.getPickerData()
        })
    }

    clearPhonenumber() {
        var country = this.state.country || '+1'
        var number = this.refs.phone.getValue()
        var phoneNumber = number
        if(number) {
            if(phoneNumber[0] != '+')
                phoneNumber = `+${phoneNumber}`
            phoneNumber = this.refs.phone.possiblyEliminateZeroAfterCountryCode(phoneNumber);
            country = PhoneNumber.getDialCode(phoneNumber)
        }

        this.refs.phone.updateFlagAndFormatNumber( country );
    }

    doContinue() {
        if (!Util.validatePhonenumber( this.refs.phone.getValue() )) {
            this.refs.toast.show('Please enter a valid phone number');
            return;
        }

        var phoneNumber = this.refs.phone.getValue()

        // check phone number is inputed
        if (phoneNumber.length < 5) {
            this.refs.toast.show('Please enter a valid phone number');
            return;
        }

        this.props.navigator.push({
            screen: 'Registration.VerificationPage',
            passProps: {
				phoneNumber,
			}
        });
    }
    
    onPressFlag() {
        this.refs.countryPicker.open()
    }
    
    selectCountry(country) {
        // save the country code in order to reset the editor
        this.setState({
            country: country
        })

        this.refs.phone.selectCountry(country.iso2)
    }

    goTermsAndConditionsPage = () => {
        this.props.navigator.push({
            screen: 'Settings.TermsAndConditionsPage'
        });
    }

	render() {
        let logoImage = require('../assets/images/BW_Logo2.png');
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={ [Styles.innerContainer, Styles.normalPadding, Styles.centerContainer] } >
                        <View>
                            <Image source={ logoImage } />
                        </View>

                        <View style={ Styles.centerInColumn } >
                            <Text style={ [Styles.largePaddingTop, Styles.largeFont, Styles.darkGrayColor] } >Welcome to</Text>
                            <Text style={ [Styles.largeFont, Styles.darkGrayColor] } >Boulder World</Text>
                        </View>

                        <View style={ Styles.centerInColumn } >
                            <Text style={ [Styles.normalPaddingTop, Styles.smallFont, Styles.lightGrayColor] } >Please login or sign up with your mobile number</Text>
                        </View>

                        {/* phone number */}
                        <View style={ Styles.centerInColumn } >
                            <View style={ [Styles.centerInRow, Styles.normalPaddingTop] } >
                                <PhoneInput
                                    ref='phone'
                                    style={ {flex: 1, height: moderateScale(40)} }
                                    textStyle= { {color: '#696969', fontSize: moderateScale(15), height: moderateScale(40)} }
                                    flagStyle={ {
                                        height: moderateScale(20),
                                        width: moderateScale(30),
                                    } }
                                    // onPressFlag={this.onPressFlag}
                                    initialCountry='sg'
                                    autoFocus={true}
                                />

                                <ModalPickerImage
                                    ref='countryPicker'
                                    data={this.state.pickerData}
                                    onChange={(country)=>{ this.selectCountry(country) }}
                                    cancelText='Cancel'
                                />

                                <Icon name="circle-with-cross"
                                    type="entypo"
                                    size={moderateScale(30)}
                                    color="#d8d8d8"
                                    onPress={() => this.clearPhonenumber()}
                                />
                            </View>

                            <View style={ [Styles.centerInRow] } >
                                <View style={ [ Styles.stretch, Styles.underline, Styles.verySmallPaddingTop] }/>
                            </View>
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        {/* continue button */}
                        <View>
                            <Button
                                textStyle={ [Styles.smallFont, Styles.darkGrayColor] }                    
                                style={[style.inactiveButton]}
                                onPress={() => this.doContinue()}>
                                CONTINUE
                            </Button>
                        </View>

                        <View style={ Styles.centerInColumn } >
                            <Text style={ [Styles.largePaddingTop, Styles.smallFont, Styles.lightGrayColor, Styles.textAlignCenter] } >By continuing, you are indicating that you agree to the</Text>
                            
                            <TouchableOpacity key={1} onPress={() => this.goTermsAndConditionsPage() }>
                                <Text style={ [Styles.smallPaddingTop, Styles.smallFont, Styles.lightGreenColor] } >
                                    Privacy policy
                                    <Text style={ [Styles.smallFont, Styles.lightGrayColor] } > and </Text>
                                    Terms
                                </Text>                      
                            </TouchableOpacity>                            
                        </View>
                        
                        <Toast ref="toast"/>
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
		);
	}
}

const style = StyleSheet.create({
    underline: {
        flex: 1
    },
    
    inactiveButton: {
        borderColor: '#d8d8d8',
        backgroundColor: '#d8d8d8',
        width: moderateScale(138),
        height: moderateScale(32),
        borderRadius: 5,
    },
    
})

PhonenumberPage.navigatorStyle = {
    navBarHidden: Platform.OS === "ios" ? true : true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent',
};