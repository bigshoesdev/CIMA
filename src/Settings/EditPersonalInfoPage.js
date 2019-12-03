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

import Button from 'apsl-react-native-button'
import { Dropdown } from 'react-native-material-dropdown'

import * as Storage from '../Helper/Storage'
import * as Util from '../Helper/Util'
import * as Configuration from '../constants/configuration'

import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'

import PhoneInput from 'react-native-phone-input'
import ModalPickerImage from '../ModalPickerImage'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import firebase from 'react-native-firebase'

class EditPersonalInfoPage extends Component {
	constructor(props) {
        super(props);

        this.confirmValue = this.confirmValue.bind(this)
        this.valueChanged = this.valueChanged.bind(this)
        this.valueSelected = this.valueSelected.bind(this)

        this.state = {
            value: this.props.initialValue
        }
    }

    async componentDidMount() {
        this.firstName = await Storage.getFirstName()
        this.lastName = await Storage.getLastName()
        this.userPhonenumber = await Storage.getPhonenumber()
    }

    valueSelected( value ) {
        this.setState({
            value
        })
    }

    confirmValue() {
        switch (this.props.type) {
            case types.GENDER_CHANGED:
                this.props.actions.genderChanged( this.state.value )
                break
            case types.EMAIL_CHANGED:
                if (this.state.value != '' && !Util.validateEmail( this.state.value )) {
                    this.refs.toast.show( 'Please verify your email address' );
                    return
                }
                this.props.actions.emailChanged( this.state.value )
                break
            case types.ADDRESS_CHANGED:
                this.props.actions.addressChanged( this.state.value )
                break
    
            // guardian/emergency
            case types.GUARDIANEMERGENCYPERSON_CHANGED:
                if ( this.state.value == this.firstName + ' ' + this.lastName ) {
                    this.refs.toast.show('Sorry, you cannot input your name.')
                    return
                }

                if ( this.state.value == '' ) {
                    this.refs.toast.show('Sorry, name is empty')
                    return
                }
                
                this.props.actions.guardianEmergencyPersonChanged( this.state.value )
                break
            case types.GUARDIANEMERGENCYNUMBER_CHANGED:
                if ( this.state.value == this.userPhonenumber ) {
                    this.refs.toast.show('Sorry, you cannot input your phone number.')
                    return
                }

                if ( this.state.value == '' || Util.isPhonenumberEmpty( this.state.value ) ) {
                    this.refs.toast.show('Sorry, phone number is empty')
                    return
                }

                if (!Util.validatePhonenumber( this.state.value )) {
                    this.refs.toast.show('Please enter a valid phone number');
                    return;
                }

                // if ( Configuration.RELEASE_MODE ) {
                //     this.verifyPhoneNumber()
                //     return
                // }

                this.props.actions.guardianEmergencyNumberChanged( this.state.value )
                break
            case types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED:
                this.props.actions.guardianEmergencyRelationshipChanged( this.state.value )
                break
        }

        this.props.navigator.pop({
        });
    }

    valueChanged(e) {
        this.setState( {
            value: e.nativeEvent.text,
        } )
    }

    contactNumberChanged = (number) => {
        this.setState( {
            value: number,
        } )
    }

    verifyPhoneNumber = () => {
        const phoneNumber = Util.trimSpace( this.state.value );

        this.showProgress()
    
        firebase.auth().verifyPhoneNumber(phoneNumber)
        .on('state_changed', (phoneAuthSnapshot) => {
            switch (phoneAuthSnapshot.state) {
                case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                    this.hideProgress()

                    console.log('code sent');

                    this.props.actions.guardianEmergencyNumberChanged( this.state.value )

                    this.props.navigator.pop({
                    });

                    break;
                case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                    this.hideProgress()

                    console.log('verification error');
                    this.refs.toast.show('verification error: ' + phoneAuthSnapshot.error);
                    break;
                case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                    this.hideProgress()

                    this.refs.toast.show('auto verify on android timed out');
                    break;
            }
        }, (error) => {
            this.hideProgress()

            console.log(error);
            this.refs.toast.show('Verification error: ' + error);
        }, (phoneAuthSnapshot) => {
            this.hideProgress()

            console.log(phoneAuthSnapshot);
        });
    }

    showProgress = () => this.setState({ isProgressVisible: true })
    
    hideProgress = () => this.setState({ isProgressVisible: false })

	render() {
        let backgroundImage = require('../assets/images/background.png');

        const { 
            gender,
            email,
            address,

            // guardia/emergency
            guardianEmergencyPerson,
            guardianEmergencyNumber,
            guardianEmergencyRelationship,
        } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                        <View >
                            <Text style={ [Styles.lightGrayColor, Styles.largeFont, Styles.textAlignCenter] }>{this.props.title}</Text>
                        </View>

                        {/* space */}
                        <View style={ [Styles.superLargeSpace] } />

                        {/* Value */}
                        <View style={style.valueContainer}>
                            <TextInput 
                                style={ [this.props.type == types.EMAIL_CHANGED || this.props.type == types.ADDRESS_CHANGED || this.props.type == types.GUARDIANEMERGENCYPERSON_CHANGED? Styles.visible : Styles.hidden, style.valueInput, Styles.grayBorder, Styles.lightGrayColor, Styles.middleFont, Styles.smallPadding] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                onChange={this.valueChanged}
                                value={this.state.value}
                                keyboardType={this.props.inputeType}
                                autoCapitalize = "none"
                            />

                            {/* phone number */}
                            <View style={ [this.props.type == types.GUARDIANEMERGENCYNUMBER_CHANGED? Styles.visible:Styles.hidden, Styles.centerInColumn] } >
                                <View style={ [Styles.centerInRow, Styles.normalPaddingTop] } >
                                    <PhoneInput
                                        ref='phone'
                                        style={ {flex: 1, height: moderateScale(40)} }
                                        textStyle= { {color: '#696969', fontSize: moderateScale(15), height: moderateScale(40)} }
                                        flagStyle={ {
                                            height: moderateScale(20),
                                            width: moderateScale(30),
                                        } }
                                        onPressFlag={this.onPressFlag}
                                        initialCountry='sg'
                                        onChangePhoneNumber={this.contactNumberChanged}
                                        value={ this.state.value }
                                    />

                                    <ModalPickerImage
                                        ref='countryPicker'
                                        data={this.state.pickerData}
                                        onChange={(country)=>{ this.selectCountry(country) }}
                                        cancelText='Cancel'
                                    />
                                </View>

                                <View style={ [Styles.centerInRow] } >
                                    <View style={ [ Styles.stretch, Styles.underline, Styles.verySmallPaddingTop] }/>
                                </View>
                            </View>

                            <Dropdown
                                containerStyle={ [this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED || this.props.type == types.GENDER_CHANGED? Styles.visible : Styles.hidden, style.dropDown] }
                                textColor = '#696969'
                                baseColor = '#696969'
                                onChangeText={this.valueSelected}
                                data={ this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED? relationshipData : genderData }
                                label={ this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED? 'Select relationship':'Select gender' }
                                value={this.state.value}
                                fontSize={ moderateScale(16) }
                                labelFontSize={ moderateScale(12) }
                            />
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalPadding] } />

                        {/* Send button */}
                        <Button
                            textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                            style={[Styles.activeButton,]}
                            activeOpacity={0.5}
                            onPress={() => this.confirmValue()} >
                            CONFIRM
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
    valueContainer: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
    },
    valueInput: {
        height: moderateScale(40),
        alignSelf: 'stretch'
    },
    dropDown: {
        alignSelf: 'stretch'
    }
})

const relationshipData = [
    { value: 'Parent' },
    { value: 'Sibling' },
    { value: 'Partner' },
    { value: 'Friend' },
];

const genderData = [
    { value: 'Male' },
    { value: 'Female' }
];

EditPersonalInfoPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

EditPersonalInfoPage.propTypes = {
    gender: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,

    // guardian/emergency info
    guardianEmergencyPerson: PropTypes.string,
    guardianEmergencyNumber: PropTypes.string,
    guardianEmergencyRelationship: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
    return {
        gender: state.cima.gender,
        email: state.cima.email,
        address: state.cima.address,
    
        // guardian/emergency info
        guardianEmergencyPerson: state.cima.guardianEmergencyPerson,
        guardianEmergencyNumber: state.cima.guardianEmergencyNumber,
        guardianEmergencyRelationship: state.cima.guardianEmergencyRelationship,
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPersonalInfoPage);