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

import PhoneInput from 'react-native-phone-input'
import ModalPickerImage from '../ModalPickerImage'

import Button from 'apsl-react-native-button'
import { Dropdown } from 'react-native-material-dropdown'

import * as Storage from '../Helper/Storage'
import * as Util from '../Helper/Util'
import * as Configuration from '../constants/configuration'

import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import firebase from 'react-native-firebase'

class EmergencyContactUpdatePage extends Component {
	constructor(props) {
        super(props);

        this.confirmValue = this.confirmValue.bind(this)
        this.valueChanged = this.valueChanged.bind(this)
        this.valueSelected = this.valueSelected.bind(this)

        this.state = {
            value: this.props.initialValue,
        }

        switch (this.props.type) {    
            // guardian/emergency
            case types.GUARDIANEMERGENCYPERSON_CHANGED:
                this.state = {
                    ...this.state,
                    enableNextButton: this.props.initialValue.length > 1
                }
                break
            case types.GUARDIANEMERGENCYNUMBER_CHANGED:
                this.state = {
                    ...this.state,
                    enableNextButton: !Util.isPhonenumberEmpty(this.props.initialValue)
                }
                break
            case types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED:
                this.state = {
                    ...this.state,
                    enableNextButton: this.props.initialValue.length > 0
                }
                break
        }
    }

    async componentDidMount() {
        this.firstName = await Storage.getFirstName()
        this.lastName = await Storage.getLastName()
        this.userPhonenumber = await Storage.getPhonenumber()
    }

    valueSelected( value ) {
        this.setState({
            value,
            enableNextButton: value.length > 0
        })
    }

    confirmValue() {
        if (!this.state.enableNextButton) {
            return;
        }

        switch (this.props.type) {    
            // guardian/emergency
            case types.GUARDIANEMERGENCYPERSON_CHANGED:
                if ( this.state.value == this.firstName + ' ' + this.lastName ) {
                    this.refs.toast.show('Sorry, you cannot input your name.')
                    return
                }

                if ( !Util.validateAlphabetic(this.state.value) ) {
                    this.refs.toast.show('Name is only acceptible alphabet')
                    return
                }

                this.props.actions.guardianEmergencyPersonChanged( this.state.value )
                break
            case types.GUARDIANEMERGENCYNUMBER_CHANGED:
                if ( this.state.value == this.userPhonenumber ) {
                    this.refs.toast.show('Sorry, you cannot input your phone number.')
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
            enableNextButton: e.nativeEvent.text.length > 1
        } )
    }

    contactNumberChanged = (number) => {
        this.setState({
            value: number,
            enableNextButton: !Util.isPhonenumberEmpty(number)
        })
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
        const { 
            // guardia/emergency
            guardianEmergencyPerson,
            guardianEmergencyNumber,
            guardianEmergencyRelationship,
        } = this.props;

		return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >

                    {/* space */}
                    <View style={ [Styles.superLargeSpace] } />

                    {/* space */}
                    <View style={ [Styles.superLargeSpace] } />

                    {/* Value */}
                    <View style={style.valueContainer}>
                        <TextInput 
                            style={ [this.props.type == types.GUARDIANEMERGENCYPERSON_CHANGED? Styles.visible : Styles.hidden, style.valueInput, Styles.grayBorder, Styles.lightGrayColor, Styles.middleFont, Styles.smallPadding] } 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChange={this.valueChanged}
                            value={this.state.value}
                            keyboardType={this.props.inputeType}
                            autoCapitalize = "none"
                        />

                        {/* phone number */}
                        <View style={ [this.props.type == types.GUARDIANEMERGENCYNUMBER_CHANGED? Styles.visible : Styles.hidden, Styles.centerInColumn] } >
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
                            containerStyle={ [this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED? Styles.visible : Styles.hidden, style.dropdownContainer] }
                            textColor = '#696969'
                            baseColor = '#696969'
                            onChangeText={this.valueSelected}
                            data={ relationshipData }
                            label={ 'Select relationship' }
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
                        style={ this.state.enableNextButton? Styles.activeButton: Styles.inactiveButton}
                        activeOpacity={this.state.enableNextButton? 0.5:1}
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
    dropdownContainer: {
        height: moderateScale(65),
        alignSelf: 'stretch'
    }
})

const relationshipData = [
    { value: 'Parent' },
    { value: 'Sibling' },
    { value: 'Partner' },
    { value: 'Friend' },
];

EmergencyContactUpdatePage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

EmergencyContactUpdatePage.propTypes = {
    // guardian/emergency info
    guardianEmergencyPerson: PropTypes.string,
    guardianEmergencyNumber: PropTypes.string,
    guardianEmergencyRelationship: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
    return {
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

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyContactUpdatePage);