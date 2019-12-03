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

import { Icon } from 'react-native-elements';
import Button from 'apsl-react-native-button'
import ImagePicker from 'react-native-image-picker';
import * as Storage from '../Helper/Storage'
import * as Util from '../Helper/Util'
import { Navigation } from 'react-native-navigation'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar';

import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'

import firebase from 'react-native-firebase';

class PersonalInfoPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            isProgressVisible: false,
        }

        this.clickToAddText = 'Please click to add'
        this.avatarBase64 = ''

        this.goQualificationPage = this.goQualificationPage.bind(this)
        this.goEditPersonalInfoPage = this.goEditPersonalInfoPage.bind(this)
        this.updateSuccess = this.updateSuccess.bind(this)
        this.updateFailed = this.updateFailed.bind(this)
    }

    showProgress = () => this.setState({ isProgressVisible: true })
    
    hideProgress = () => this.setState({ isProgressVisible: false })

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.token = await Storage.getToken()

        // personal info
        this.props.actions.avatarUriChanged( await Storage.getAvatarUri() )
        this.props.actions.firstNameChanged( await Storage.getFirstName() )
        this.props.actions.lastNameChanged( await Storage.getLastName() )
        this.props.actions.nricChanged( await Storage.getNRIC() )
        this.props.actions.dobChanged( await Storage.getDOB() )
        this.props.actions.genderChanged( await Storage.getGender() )
        this.props.actions.phoneNumberChanged( await Storage.getPhonenumber() )
        this.props.actions.emailChanged( await Storage.getEmail() )
        this.props.actions.addressChanged( await Storage.getAddress() )

        // guardian/emergency info
        this.props.actions.guardianEmergencyPersonChanged( await Storage.getEmergencyPerson() )
        this.props.actions.guardianEmergencyNumberChanged( await Storage.getEmergencyNumber() )
        this.props.actions.guardianEmergencyRelationshipChanged( await Storage.getEmergencyRelationship() )

        // qualification
        this.props.actions.qualificationChanged( JSON.parse(await Storage.getQualification()) )
    }

    goEditPersonalInfoPage( type, title, initialValue, inputeType = 'default' ) {
        this.props.navigator.push({
            screen: 'Settings.EditPersonalInfoPage',
            passProps: {
                type,
                title,
                initialValue,
                inputeType
			}
        });
    }

    goQualificationPage() {
        this.props.navigator.push({
            screen: 'Settings.QualificationPage',
            passProps: {
                qualification: this.props.qualification
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
                this.avatarBase64 = response.data
            }
		});
    }

    updateSuccess(res) {
        console.log('server --> client(update success): ', res.data)

        // check if user is registered.
        if (res.data.result === Api.OK) {
            Storage.setAvatarUri( Api.SERVER_URL + res.data.users.picture_avatar )
            Storage.setGender( this.props.gender )
            Storage.setEmail( this.props.email )
            Storage.setAddress( this.props.address )
    
            // guardian/emergency info
            Storage.setEmergencyPerson( this.props.guardianEmergencyPerson )
            Storage.setEmergencyNumber( this.props.guardianEmergencyNumber )
            Storage.setEmergencyRelationship( this.props.guardianEmergencyRelationship )
            
            // qualification
            Storage.setQualification( JSON.stringify(this.props.qualification) )

            Storage.setToken(res.data.users.user_token)

            // pass
            Storage.setPasses( JSON.stringify(res.data.pass) )

            // update ui
            var personalInfo = {
                avatarUri: this.props.avatarUri,
                firstName: this.props.firstName,
                lastName: this.props.lastName,
                nric: this.props.nric,
                dob: this.props.dob,
                gender: this.props.gender,
                phoneNumber: this.props.phoneNumber,
                email: this.props.email,
                address: this.props.address
            }
    
            this.props.actions.personalInfoChanged( personalInfo )

            var passesInfo = res.data.pass
    
            // update available passes
            passesInfo.map((item, i) => {

                var passInfo = {
                    type: item.type,
                    from: item.from,
                    to: item.to,
                    available: true,
                    used: item.used,
                    quantity: item.quantity
                }
    
                switch (item.type) {
                    case Api.SEASONPASS_TYPE: 
                        seasonPassUpdated = true
                        this.props.actions.seasonPassChanged( passInfo )
                        break;
                    case Api.MULTIPASS_TYPE: 
                        multiPassUpdated = true
                        this.props.actions.multiPassChanged( passInfo )
                        break;
                    case Api.DAYPASS_TYPE: 
                        dayPassUpdated = true
                        this.props.actions.dayPassChanged( passInfo )
                        break;
                    case Api.PROMOPASS_TYPE: 
                        promoPassUpdated = true
                        this.props.actions.promoPassChanged( passInfo )
                        break;
                }
            }) // passesInfo.map((item, i)
    
            this.props.navigator.pop({
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

    updateFailed(err) {
        console.log('server --> client(update failed): ', err)
        
        // hide modal
        this.hideProgress()

        this.refs.toast.show('Opps there has been some issue with our server, please try again later.');
    }

    savePersonalInfo() {
        // show progress dialog
        this.showProgress()

        var param = {
            user_id: this.userId,
            user_token: this.token,
            user_phoneNumber: this.props.phoneNumber,
            user_email: this.props.email,
            user_address: this.props.address,
            firstName: this.props.firstName,
            familyName: this.props.lastName,
            birthDate: this.props.dob,
            nric_passNumber: this.props.nric,
            gender: this.props.gender,
            picture_avatar: this.avatarBase64,
            qualification: this.props.qualification,
            promo: true
        }
        
        if ( Util.isLessThan18( this.props.dob ) ) {
            param = {
                ...param,
                guardian_name: this.props.guardianEmergencyPerson,
                guardian_phoneNumber: this.props.guardianEmergencyNumber,
                guardian_relationship: this.props.guardianEmergencyRelationship,
            }
        } else {
            param = {
                ...param,
                emergency_name: this.props.guardianEmergencyPerson,
                emergency_phoneNumber: this.props.guardianEmergencyNumber,
                emergency_relationship: this.props.guardianEmergencyRelationship,
            }
        }

        if (
            this.props.phoneNumber == '' ||
            this.props.email == '' ||
            this.props.address == '' ||
            this.props.firstName == '' ||
            this.props.lastName == '' ||
            this.props.gender == '' ||
            this.props.qualification.length < 1 ||
            this.props.guardianEmergencyPerson == '' ||
            this.props.guardianEmergencyNumber == '' ||
            this.props.guardianEmergencyRelationship == ''
        ) {
            param = {
                ...param,
                full: false
            }
        } else {
            param = {
                ...param,
                full: true
            }
        }

        console.log('client --> server(update): ', param)

        CIMAService.sendPostRequestAsync(Api.SIGNUP, param, this.updateSuccess, this.updateFailed)
    }

    onAvatarError = () => {
        this.props.actions.avatarUriChanged( '' )
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

        const { 
            avatarUri,
            firstName,
            lastName,
            nric,
            dob,
            gender,
            phoneNumber,
            email,
            address,

            // guardia/emergency
            guardianEmergencyPerson,
            guardianEmergencyNumber,
            guardianEmergencyRelationship,
            
            // qualification
            qualification,
        } = this.props;

		return (
			<ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={[ Styles.innerContainer, style.container, Styles.normalPadding]}>
                    <View style={style.avatarImage}>
                        <TouchableOpacity onPress={() => this.openImagePicker() }>
                            { 
                                avatarUri == '' ? 
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

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    <ScrollView style={style.scrollView}>
                        {/* Personal Info */}
                        <View style={ [ Styles.normalPaddingTop] } >
                            <Text style={ [Styles.lightGrayColor, Styles.largeFont,] }>PERSONAL</Text>                                
                        </View>

                        <View style={ [Styles.centerInColumn, Styles.smallPaddingTop] } >
                            <View style={ [Styles.centerInRow] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>NAME:</Text>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{firstName} {lastName}</Text>
                            </View>

                            <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>NRIC:</Text>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{nric}</Text>
                            </View>

                            <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>DOB:</Text>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{dob}</Text>
                            </View>

                            <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>GENDER:</Text>
                                <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goEditPersonalInfoPage(types.GENDER_CHANGED, 'GENDER', gender) }>
                                    <Text ref='gender' style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch] }>{gender == ''? this.clickToAddText:gender}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>MOBILE:</Text>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{phoneNumber}</Text>
                            </View>

                            <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>EMAIL:</Text>
                                <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goEditPersonalInfoPage(types.EMAIL_CHANGED, 'E-MAIL', email, 'email-address') }>
                                    <Text ref='email' style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch] }>{email == ''? this.clickToAddText:email}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>ADDRESS:</Text>
                                <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goEditPersonalInfoPage(types.ADDRESS_CHANGED, 'ADDRESS', address) }>
                                    <Text ref='address' style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch] }>{address == ''? this.clickToAddText:address}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* underline */}
                        <View style={ [Styles.centerInRow, Styles.smallMargin, Styles.smallPaddingTop] } >
                            <View style={ [ Styles.stretch, style.underline] }/>
                        </View>

                        {/* GUARDIAN/EMERGENCY CONTACT Info */}
                        <View style={ [ Styles.normalPaddingTop] } >
                            <Text style={ [Styles.lightGrayColor, Styles.largeFont,] }>{Util.isLessThan18( dob )? 'GUARDIAN':'EMERGENCY'} CONTACT</Text>                                
                        </View>

                        <View style={ [Styles.centerInColumn, Styles.smallPaddingTop] } >
                            <View style={ [Styles.centerInRow] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>NAME:</Text>
                                <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goEditPersonalInfoPage(types.GUARDIANEMERGENCYPERSON_CHANGED, (Util.isLessThan18( dob )? 'GUARDIAN':'EMERGENCY') + ' NAME', guardianEmergencyPerson) }>
                                    <Text ref='guardianEmergencyPerson' style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch] }>{guardianEmergencyPerson == ''? this.clickToAddText:guardianEmergencyPerson}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>CONTACT:</Text>
                                <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goEditPersonalInfoPage(types.GUARDIANEMERGENCYNUMBER_CHANGED, (Util.isLessThan18( dob )? 'GUARDIAN':'EMERGENCY') + ' CONTACT', guardianEmergencyNumber, 'phone-pad') }>
                                    <Text ref='guardianEmergencyNumber' style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch] }>{guardianEmergencyNumber == ''? this.clickToAddText:guardianEmergencyNumber}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                                <Text style={ [style.keyColor, Styles.middleFont, Styles.stretch2X] }>RELATIONSHIP:</Text>
                                <TouchableOpacity style={ Styles.stretch3X } onPress={() => this.goEditPersonalInfoPage(types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED, (Util.isLessThan18( dob )? 'GUARDIAN':'EMERGENCY') + ' RELATIONSHIP', guardianEmergencyRelationship) }>
                                    <Text ref='guardianEmergencyRelationship' style={ [Styles.lightGreenColor, Styles.middleFont, Styles.stretch] }>{guardianEmergencyRelationship == ''? this.clickToAddText:guardianEmergencyRelationship}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* underline */}
                        <View style={ [Styles.centerInRow, Styles.smallMargin, Styles.smallPaddingTop] } >
                            <View style={ [ Styles.stretch, style.underline] }/>
                        </View>

                        {/* CLIMBING QUALIFICATION */}
                        <View style={ [ Styles.normalPaddingTop] } >
                            <Text style={ [Styles.lightGrayColor, Styles.largeFont,] }>CLIMBING QUALIFICATION</Text>                                
                        </View>

                        <View style={ [style.qualificationContainer, Styles.smallPaddingTop] } >
                            <View >
                                {qualification.map((item, i) => 
                                    <View key={i}>
                                        {/* space */}
                                        <View style={ [Styles.smallSpace] } />
                                        <Text style={ [Styles.lightGrayColor, Styles.smallFont, Styles.textAlignLeft] }>{item}</Text>
                                    </View>
                                )}

                                <View style={ [Styles.smallSpace] } />
                                <TouchableOpacity onPress={() => this.goQualificationPage() }>
                                    <Text style={ [Styles.lightGreenColor, Styles.middleFont, Styles.textAlignLeft] }>{this.clickToAddText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* space */}
                        <View style={ [Styles.middleSpace] } />
                    </ScrollView>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* Confirm button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.savePersonalInfo()} >
                        SAVE
                    </Button>

                    <Toast ref="toast"/>

                    {/* progress dialog */}
                    <Modal isVisible={this.state.isProgressVisible}>
                        <View style={ [Styles.centerInColumn, ] }>
                            <ProgressBar />
                        </View>
                    </Modal>
                </View>
            </ImageBackground>
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
    sectionContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    scrollView: {
        alignSelf: 'stretch'
    },
    underline: {
        borderBottomWidth: 1,
        borderBottomColor: '#4FBCA4'
    },
    qualificationContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    keyColor: {
        color: '#0D4C6B'
    },
})

PersonalInfoPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

PersonalInfoPage.propTypes = {
	actions: PropTypes.object.isRequired,
    avatarUri: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    nric: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    gender: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,

    // guardian/emergency info
    guardianEmergencyPerson: PropTypes.string,
    guardianEmergencyNumber: PropTypes.string,
    guardianEmergencyRelationship: PropTypes.string,
    
    // qualification
    qualification: PropTypes.array,
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
        email: state.cima.email,
        address: state.cima.address,
    
        // guardian/emergency info
        guardianEmergencyPerson: state.cima.guardianEmergencyPerson,
        guardianEmergencyNumber: state.cima.guardianEmergencyNumber,
        guardianEmergencyRelationship: state.cima.guardianEmergencyRelationship,
        
        // qualification
        qualification: state.cima.qualification
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfoPage);