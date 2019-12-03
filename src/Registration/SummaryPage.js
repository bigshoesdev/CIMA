import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles'

import { Icon } from 'react-native-elements'
import Checkbox from 'react-native-custom-checkbox'
import Button from 'apsl-react-native-button'
import ImagePicker from 'react-native-image-picker'
import * as Storage from '../Helper/Storage'
import * as Util from '../Helper/Util'
import PhoneInput from 'react-native-phone-input'
import ModalPickerImage from '../ModalPickerImage'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';
import { moderateScale } from '../Helper/Scaling';

class SummaryPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            checked: false,
            enableConfirmButton: false
        };

        this.confirmSummary = this.confirmSummary.bind(this)
        this.checkboxClicked = this.checkboxClicked.bind(this)
    }

    async componentDidMount() {
        // personal info
        this.props.actions.avatarUriChanged( await Storage.getAvatarUri() )
        this.props.actions.firstNameChanged( await Storage.getFirstName() )
        this.props.actions.lastNameChanged( await Storage.getLastName() )
        this.props.actions.nricChanged( await Storage.getNRIC() )
        this.props.actions.dobChanged( await Storage.getDOB() )
        this.props.actions.phoneNumberChanged( await Storage.getPhonenumber() )

        // guardian/emergency info
        this.props.actions.guardianEmergencyPersonChanged( await Storage.getEmergencyPerson() )
        this.props.actions.guardianEmergencyNumberChanged( await Storage.getEmergencyNumber() )
        this.props.actions.guardianEmergencyRelationshipChanged( await Storage.getEmergencyRelationship() )
    }

    confirmSummary() {
        if (!this.state.enableConfirmButton) {
            return;
        }
        
        Storage.setAvatarUri( this.props.avatarUri )

        Storage.setFirstName( this.props.firstName )
        Storage.setLastName( this.props.lastName )
        Storage.setDOB( this.props.dob )

        Storage.setEmergencyPerson(this.props.guardianEmergencyPerson)
        Storage.setEmergencyNumber(this.props.guardianEmergencyNumber)
        Storage.setEmergencyRelationship(this.props.guardianEmergencyRelationship)

        this.props.navigator.push({
            screen: 'Registration.WaiverPage',
            passProps: {
				phoneNumber: this.props.phoneNumber,
			}
        });
    }

    openImagePicker( e ) {
        var options = {
            title: 'Select Avatar',
            storageOptions: {
				skipBackup: true,
				path: 'images'
            },
            mediaType: 'photo',
            allowsEditing: true,
            quality: 0.5,
            maxHeight: 250,
            maxWidth: 250
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
          
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.props.actions.avatarUriChanged( response.uri )
            }
		});
    }

    checkboxClicked( name, checked ) {
        this.setState({
            checked: checked,
            enableConfirmButton: checked
        })
    }

    goUpdateNamePage = () => {
        this.props.navigator.push({
            screen: 'Registration.NameUpdatePage',
            passProps: {
                firstName: this.props.firstName,
                lastName: this.props.lastName,
			}
        });
    }

    goNRICUpdatePage = () => {
        this.props.navigator.push({
            screen: 'Registration.NRICUpdatePage',
            passProps: {
                nric: this.props.nric,
			}
        });
    }

    goDOBUpdatePage = () => {
        this.props.navigator.push({
            screen: 'Registration.DOBUpdatePage',
            passProps: {
                dob: this.props.dob,
			}
        });
    }

    goEmergencyUpdatePage = ( type, initialValue, inputeType = 'default' ) => {
        this.props.navigator.push({
            screen: 'Registration.EmergencyContactUpdatePage',
            passProps: {
                type,
                initialValue,
                inputeType
			}
        });
    }

    onAvatarError = () => {
        this.props.actions.avatarUriChanged( '' )
    }

	render() {
        const { 
            avatarUri,
            firstName,
            lastName,
            nric,
            dob,
            phoneNumber,

            // guardia/emergency
            guardianEmergencyPerson,
            guardianEmergencyNumber,
            guardianEmergencyRelationship
        } = this.props;

		return (
			<View style={ [Styles.normalMargin, style.container, Styles.hideLogoByBackground] } >
                <View style={ [Styles.smallMargin, style.container,] }>
                    {/* Selfie */}
                    <View style={style.avatarImage}>
                        <TouchableOpacity onPress={() => this.openImagePicker() }>
                            { 
                                avatarUri == '' || avatarUri.startsWith('http') ? 
                                <Icon name="user"
                                    type="entypo"
                                    size={moderateScale(75)}
                                    color="#d8d8d8"
                                />
                                    :
                                <Image 
                                    style={style.avatarImage} 
                                    source={ {uri: avatarUri} }
                                    onError={ this.onAvatarError }
                                />
                            }
                        </TouchableOpacity>
                    </View>

                    {/* underline */}
                    <View style={ [Styles.centerInRow, Styles.middlePaddingTop] } >
                        <View style={ [ Styles.stretch, Styles.underline] }/>
                    </View>
                    
                    {/* My Info */}
                    <View style={ [Styles.centerInColumn, Styles.middlePaddingTop] } >
                        <View style={ [Styles.centerInRow] } >
                            <Text style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch2X] }>NAME:</Text>
                            <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goUpdateNamePage() }>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{firstName} {lastName}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                            <Text style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch2X] }>NRIC:</Text>
                            <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goNRICUpdatePage() }>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{nric}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                            <Text style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch2X] }>DOB:</Text>
                            <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goDOBUpdatePage() }>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{dob}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* underline */}
                    <View style={ [Styles.centerInRow, Styles.normalPaddingTop] } >
                        <View style={ [ Styles.stretch, Styles.underline] }/>
                    </View>
                    
                    {/* Guardian/Emergency Info */}
                    <View style={ [Styles.centerInRow, Styles.normalPaddingTop] } >
                        <Text style={ [Styles.lightGrayColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>{Util.isLessThan18( dob )? 'GUARDIAN':'EMERGENCY'} CONTACT</Text>
                    </View>

                    <View style={ [Styles.centerInColumn, Styles.largePaddingTop] } >
                        <View style={ [Styles.centerInRow] } >
                            <Text style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch2X] }>NAME:</Text>
                            <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goEmergencyUpdatePage(types.GUARDIANEMERGENCYPERSON_CHANGED, guardianEmergencyPerson) }>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{guardianEmergencyPerson}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                            <Text style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch2X] }>CONTACT:</Text>
                            <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goEmergencyUpdatePage(types.GUARDIANEMERGENCYNUMBER_CHANGED, guardianEmergencyNumber, 'phone-pad') }>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{guardianEmergencyNumber}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                            <Text style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch2X] }>RELATIONSHIP:</Text>
                            <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goEmergencyUpdatePage(types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED, guardianEmergencyRelationship) }>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{guardianEmergencyRelationship}</Text>
                            </TouchableOpacity>
                        </View>

                            {/* space */}
                        <View style={ [Styles.normalSpace] } />
                        
                        <Text style={ [Styles.redColor, Styles.smallFont, style.comment] }>Click on details to edit</Text>
                    </View>

                    {/* checkbox */}
                    <View style={ [Styles.smallMargin, style.checkboxContainer, Styles.largePaddingTop] }>
                        <View>
                            <Checkbox
                                checked={this.state.checked}
                                onChange={(name, checked) => this.checkboxClicked(name, checked)}
                                style={{backgroundColor: 'white', color:'#696969', borderWidth: 1}}
                                size={moderateScale(25)}
                            />
                        </View>
                        <View>
                            <Text style={ [Styles.stretch, style.confirmMessage, Styles.lightGrayColor, Styles.smallFont] }>I confirm that all information given in this form is true, complete and accurate.</Text>
                        </View>                    
                    </View>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />
                </View>

                {/* Confirm button */}
                <Button
                    textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                    style={ this.state.enableConfirmButton? Styles.activeButton: Styles.inactiveButton}
                    activeOpacity={this.state.enableConfirmButton? 0.5:1}
                    onPress={() => this.confirmSummary()} >
                    CONFIRM
                </Button>
            </View>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatarImage: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderWidth: moderateScale(2),
        borderColor: '#d8d8d8',
        borderRadius: moderateScale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    confirmMessage: {
        paddingLeft: moderateScale(10),
        height: moderateScale(40),
    },
    comment: {
        alignSelf: 'stretch'
    }
})

SummaryPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

SummaryPage.propTypes = {
	actions: PropTypes.object.isRequired,
    avatarUri: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    nric: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,

    // guardian/emergency info
    guardianEmergencyPerson: PropTypes.string.isRequired,
    guardianEmergencyNumber: PropTypes.string.isRequired,
    guardianEmergencyRelationship: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
    return {
        avatarUri: state.cima.avatarUri,
        firstName: state.cima.firstName,
        lastName: state.cima.lastName,
        nric: state.cima.nric,
        dob: state.cima.dob,
        gender: state.cima.gender,
        phoneNumber: state.cima.phoneNumber,
    
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

export default connect(mapStateToProps, mapDispatchToProps)(SummaryPage);