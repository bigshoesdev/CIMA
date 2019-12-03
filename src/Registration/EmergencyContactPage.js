// import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import { Dropdown } from 'react-native-material-dropdown'
import { Icon } from 'react-native-elements'
import Button from 'apsl-react-native-button'
import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'

import * as Storage from '../Helper/Storage'
import * as Util from '../Helper/Util'
import * as Configuration from '../constants/configuration'

import PhoneInput from 'react-native-phone-input'
import ModalPickerImage from '../ModalPickerImage'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import firebase from 'react-native-firebase'

class EmergencyContactPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            enableNextButton: false,
            activeTextInput: null
        }

        this.contactPersonChanged = this.contactPersonChanged.bind(this)
        this.contactNumberChanged = this.contactNumberChanged.bind(this)
        this.contactRelationshipChanged = this.contactRelationshipChanged.bind(this)
    }

    async componentDidMount() {
        this.firstName = await Storage.getFirstName()
        this.lastName = await Storage.getLastName()
        this.userPhonenumber = await Storage.getPhonenumber()

        contactPerson = await Storage.getEmergencyPerson()
        this.props.actions.guardianEmergencyPersonChanged( contactPerson )

        contactNumber = await Storage.getEmergencyNumber()
        this.props.actions.guardianEmergencyNumberChanged( contactNumber == ''? '+65': contactNumber )

        contactRelationship = await Storage.getEmergencyRelationship()
        this.props.actions.guardianEmergencyRelationshipChanged( contactRelationship )

        this.setState({
            enableNextButton: contactPerson.length > 1 && !Util.isPhonenumberEmpty( contactNumber ) && contactRelationship.length > 0
        })
    }

    contactPersonChanged(e) {
        contactPerson = e.nativeEvent.text
        this.props.actions.guardianEmergencyPersonChanged( contactPerson )

        // check the possibility of next move.
        this.setState( {
            enableNextButton: contactPerson.length > 1 && !Util.isPhonenumberEmpty(this.props.contactNumber) && this.props.contactRelationship.length > 0
        } )
    }

    contactNumberChanged(number) {
        contactNumber = number
        this.props.actions.guardianEmergencyNumberChanged( contactNumber )

        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.props.contactPerson.length > 1 && !Util.isPhonenumberEmpty( contactNumber ) && this.props.contactRelationship.length > 0
        } )
    }

    contactRelationshipChanged( relationship ) {
        contactRelationship = relationship
        this.props.actions.guardianEmergencyRelationshipChanged( contactRelationship )
        
        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.props.contactPerson.length > 1 && !Util.isPhonenumberEmpty(this.props.contactNumber) && this.props.contactRelationship.length > 0
        } )

        if ( this.state.activeTextInput ) {
            this.state.activeTextInput.focus()
        }
    }

    goNextPage() {
        if (!this.state.enableNextButton) {
            return;
        }

        if ( this.props.contactPerson == this.firstName + ' ' + this.lastName ) {
            this.refs.toast.show('Sorry, you cannot input your name.')
            return
        }

        if ( !Util.validateAlphabetic(this.props.contactPerson) ) {
            this.refs.toast.show('Name is only acceptible alphabet')
            return
        }

        if ( this.props.contactNumber == this.userPhonenumber ) {
            this.refs.toast.show('Sorry, you cannot input your phone number.')
            return
        }

        if (!Util.validatePhonenumber( this.props.contactNumber )) {
            this.refs.toast.show('Please enter a valid phone number');
            return;
        }

        // if ( Configuration.RELEASE_MODE ) {
        //     this.verifyPhoneNumber()
        //     return
        // }

        Storage.setEmergencyPerson(this.props.contactPerson)
        Storage.setEmergencyNumber(this.props.contactNumber)
        Storage.setEmergencyRelationship(this.props.contactRelationship)

        this.props.navigator.push({
            screen: 'Registration.SelfiePage',
        });
    }

    verifyPhoneNumber = () => {
        const phoneNumber = this.props.contactNumber;

        this.showProgress()
    
        firebase.auth().verifyPhoneNumber(phoneNumber)
        .on('state_changed', (phoneAuthSnapshot) => {
            switch (phoneAuthSnapshot.state) {
                case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                    this.hideProgress()

                    console.log('code sent');                    

                    Storage.setEmergencyPerson(this.props.contactPerson)
                    Storage.setEmergencyNumber(this.props.contactNumber)
                    Storage.setEmergencyRelationship(this.props.contactRelationship)

                    this.props.navigator.push({
                        screen: 'Registration.SelfiePage',
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

    contactPersonFocused = () => {
        this.setState({
            activeTextInput: this.refs.contactPerson
        })
    }

    phoneInputFocused = () => {
        this.setState({
            activeTextInput: this.refs.phone
        })
    }

	render() {
        const { 
            contactPerson,
            contactNumber,
            contactRelationship
        } = this.props;

		return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >
                    <View style={ [style.container] } >
                        {/* space */}
                        <View style={Styles.superLargeSpace} />

                        {/* Emergency Contact Person */}
                        <TextInput 
                            style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder='Emergency Contact Person' 
                            onChange={this.contactPersonChanged}
                            value={ contactPerson }
                            autoFocus={true}
                            ref='contactPerson'
                            onFocus={ this.contactPersonFocused }
                        />

                        {/* Emergency Contact Number */}
                        <View style={Styles.middleSpace} />                       
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
                                    onPressFlag={this.onPressFlag}
                                    initialCountry='sg'
                                    onChangePhoneNumber={this.contactNumberChanged}
                                    value={ contactNumber }
                                    textProps={ {
                                        onFocus: this.phoneInputFocused
                                    } }
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

                        {/* Relationship */}
                        <View style={Styles.middleSpace} />
                        <View style={ style.dropDownComponentContainer }>
                            <Dropdown
                                textColor = '#696969'
                                onChangeText={this.contactRelationshipChanged}
                                label='Select relationship'
                                data={relationship}
                                value={contactRelationship}
                                containerStyle={style.dropdownContainer}
                                fontSize={ moderateScale(16) }
                                labelFontSize={ moderateScale(12) }
                            />
                        </View>
                    </View>

                    {/* indicator */}
                    <View style={style.indicatorContainer}>
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#5EC3AE'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                    </View>

                    {/* next button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={ this.state.enableNextButton? Styles.activeButton: Styles.inactiveButton}
                        activeOpacity={this.state.enableNextButton? 0.5:1}
                        onPress={() => this.goNextPage()} >
                        NEXT
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

const relationship = [
    { value: 'Parent' },
    { value: 'Sibling' },
    { value: 'Partner' },
    { value: 'Friend' },
];

const style = StyleSheet.create({
    codeInput: {
        height: moderateScale(40),
        alignSelf: 'stretch'
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    dropDownComponentContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    dropdownContainer: {
        height: moderateScale(65),
    }
})

EmergencyContactPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

EmergencyContactPage.propTypes = {
    // guardian/emergency info
    actions: PropTypes.object.isRequired,
    contactPerson: PropTypes.string,
    contactNumber: PropTypes.string,
    contactRelationship: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        // guardian/emergency info
        contactPerson: state.cima.guardianEmergencyPerson,
        contactNumber: state.cima.guardianEmergencyNumber,
        contactRelationship: state.cima.guardianEmergencyRelationship
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyContactPage);