import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    Platform,
    TouchableOpacity    
} from 'react-native';

import { Icon } from 'react-native-elements';
import Button from 'apsl-react-native-button'
import Modal from 'react-native-modal'
import ImagePicker from 'react-native-image-picker';
import * as Storage from '../Helper/Storage'
import ProgressBar from '../Widgets/ProgressBar'
import Toast, {DURATION} from 'react-native-easy-toast'
import { Navigation } from 'react-native-navigation'

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'
import * as Configuration from '../constants/configuration'
import * as Util from '../Helper/Util'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import dateFormat from 'dateformat'

import firebase from 'react-native-firebase';

class HomePage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
            isProgressVisible: false,
        }

        this.updateTimer = -1
        this.userId = null
        this.token = null

        this.goPurchasePage = this.goPurchasePage.bind(this)
        this.goSettingPage = this.goSettingPage.bind(this)
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.userInfoThread = this.userInfoThread.bind(this)

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    async onNavigatorEvent(event) {
        switch(event.id) {
            case 'willAppear':
                break;
            case 'didAppear':
                this.setState({
                    userInfoThreadWorking: false
                })
                this.updateTimer = setInterval(this.userInfoThread, 2000)
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                clearInterval( this.updateTimer )
                break;
            case 'willCommitPreview':
                break;
        }
    }

    userInfoSuccess = (res) => {
        console.log('server --> client(user info success): ', res.data)

        this.setState({
            userInfoThreadWorking: false
        })

        // check if user is registered.
        if (res.data.result == Api.ERROR) {
            Storage.setToken( '' )

            if (Platform.OS === "android") {
                // this.hideProgress()
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
        } else if (res.data.result == Api.OK) {
            // this.hideProgress()

            // update storage
            Storage.setAvatarUri(Api.SERVER_URL + res.data.users.picture_avatar)
            Storage.setEmail(res.data.users.user_email == undefined? '':res.data.users.user_email)
            Storage.setAddress(res.data.users.user_address == undefined? '':res.data.users.user_address)
            Storage.setFirstName(res.data.users.firstName)
            Storage.setLastName(res.data.users.familyName)
            Storage.setGender(res.data.users.gender == undefined? '':res.data.users.gender)
            Storage.setPDFUrl(Api.SERVER_URL + res.data.users.pdf_url)

            // guardian/emergency info
            Storage.setEmergencyPerson( res.data.users.guardian_name === ''? res.data.users.emergency_name : res.data.users.guardian_name  )
            Storage.setEmergencyNumber( res.data.users.guardian_phoneNumber === ''? res.data.users.emergency_phoneNumber : res.data.users.guardian_phoneNumber  )
            Storage.setEmergencyRelationship( res.data.users.guardian_relationship === ''? res.data.users.emergency_relationship : res.data.users.guardian_relationship )

            Storage.setQualification( JSON.stringify(res.data.users.qualification == undefined? '[]':res.data.users.qualification) )

            // pass
            Storage.setPasses( JSON.stringify(res.data.pass) )

            // update ui
            var personalInfo = {
                avatarUri: Api.SERVER_URL + res.data.users.picture_avatar,
                firstName: res.data.users.firstName,
                lastName: res.data.users.familyName,
                gender: res.data.users.gender == undefined? '':res.data.users.gender,
                email: res.data.users.user_email == undefined? '':res.data.users.user_email,
                phoneNumber: res.data.users.user_phoneNumber,
                address: res.data.users.user_address == undefined? '':res.data.users.user_address
            }
    
            this.props.actions.personalInfoChanged( personalInfo )
    
            var passesInfo = res.data.pass

            var index = Util.getIndex( Api.SEASONPASS_TYPE, passesInfo, 'type' )

            if (index < 0 ) {
                this.props.actions.seasonPassChanged( {
                    type: Api.SEASONPASS_TYPE,
                    from: new Date().getTime(),
                    to: new Date().getTime(),
                    available: false,
                    used: false,
                    quantity: 0
                } )
            } else {
                this.props.actions.seasonPassChanged( {
                    type: passesInfo[index].type,
                    from: passesInfo[index].from,
                    to: passesInfo[index].to,
                    available: passesInfo[index].quantity > 0,
                    used: passesInfo[index].used,
                    quantity: passesInfo[index].quantity
                } )
            }

            index = Util.getIndex( Api.MULTIPASS_TYPE, passesInfo, 'type' )
            if (index < 0 ) {
                this.props.actions.multiPassChanged(  {
                    type: Api.MULTIPASS_TYPE,
                    from: new Date().getTime(),
                    to: new Date().getTime(),
                    available: false,
                    used: false,
                    quantity: 0
                }  )
            } else {
                this.props.actions.multiPassChanged( {
                    type: passesInfo[index].type,
                    from: passesInfo[index].from,
                    to: passesInfo[index].to,
                    available: passesInfo[index].quantity > 0,
                    used: passesInfo[index].used,
                    quantity: passesInfo[index].quantity
                } )
            }

            index = Util.getIndex( Api.DAYPASS_TYPE, passesInfo, 'type' )            
            if (index < 0 ) {
                this.props.actions.dayPassChanged(  {
                    type: Api.DAYPASS_TYPE,
                    from: new Date().getTime(),
                    to: new Date().getTime(),
                    available: false,
                    used: false,
                    quantity: 0
                }  )
                
            } else {
                this.props.actions.dayPassChanged( {
                    type: passesInfo[index].type,
                    from: passesInfo[index].from,
                    to: passesInfo[index].to,
                    available: passesInfo[index].quantity > 0,
                    used: passesInfo[index].used,
                    quantity: passesInfo[index].quantity
                } )
            }

            index = Util.getIndex( Api.PROMOPASS_TYPE, passesInfo, 'type' )            
            if (index < 0 ) {
                this.props.actions.promoPassChanged(  {
                    type: Api.PROMOPASS_TYPE,
                    from: new Date().getTime(),
                    to: new Date().getTime(),
                    available: false,
                    used: false,
                    quantity: 0
                }  )
            } else {
                this.props.actions.promoPassChanged( {
                    type: passesInfo[index].type,
                    from: passesInfo[index].from,
                    to: passesInfo[index].to,
                    available: passesInfo[index].quantity > 0,
                    used: passesInfo[index].used,
                    quantity: passesInfo[index].quantity
                } )
            }    
            
        } else {
            // this.hideProgress()
            
            this.refs.toast.show('Service Error');
        }
    }

    userInfoFailed = (err) => {
        console.log('server --> client(user info failed): ', err)
        
        // hide modal
        // this.hideProgress()

        this.refs.toast.show('Opps there has been some issue with our server, please try again later.');

        this.setState({
            userInfoThreadWorking: false
        })
    }

    componentWillUnmount() {
        clearInterval( this.updateTimer )
    }

    async componentDidMount() {
        if (this.props.skipUserInfoUpdate != null) {
            var personalInfo = {
                avatarUri: await Storage.getAvatarUri(),
                firstName: await Storage.getFirstName(),
                lastName: await Storage.getLastName(),
                phoneNumber: await Storage.getPhonenumber(),
            }

            this.props.actions.personalInfoChanged( personalInfo )

            var passesInfo = JSON.parse( await Storage.getPasses() )

            // refresh the pass buttons in the case of no pass
            if (passesInfo.length < 1) {
                var passInfo = {
                    from: new Date().getTime(),
                    to: new Date().getTime(),
                    available: false,
                    used: false,
                    quantity: 0
                }

                this.props.actions.seasonPassChanged( {
                    ...passInfo,
                    type: Api.SEASONPASS_TYPE,
                } )

                this.props.actions.multiPassChanged( {
                    ...passInfo,
                    type: Api.MULTIPASS_TYPE,
                } )

                this.props.actions.dayPassChanged( {
                    ...passInfo,
                    type: Api.DAYPASS_TYPE,
                } )

                this.props.actions.promoPassChanged( {
                    ...passInfo,
                    type: Api.PROMOPASS_TYPE,
                } )
            }            

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
            })

            if (await Storage.getFirstLogin() === 'true') {
                var signupDate = await Storage.getSignupDate()
                if ( signupDate != '') {
                    var validPromoDate = new Date(parseInt(signupDate))
                    validPromoDate.setMonth( validPromoDate.getMonth() + 1 )
                    validPromoDate.setHours(0, 0, 0, 0)

                    this.props.actions.validPromoDateChanged( dateFormat(validPromoDate, "dd mmm yyyy") )

                    var today = new Date()
                    today.setHours(0, 0, 0, 0)
                    if ( validPromoDate > today ) {
                        this.showModal()
                    }
                }
            }
        }

        this.userId = await Storage.getUserID()
        this.token = await Storage.getToken()
    }

    async userInfoThread() {
        this.token = await Storage.getToken()

        if ( this.userId == null || this.userId == '' ) {
            return
        }

        if ( this.token == null || this.token == '' ) {
            return
        }

        if ( this.state.userInfoThreadWorking ) {
            return
        }

        this.setState({
            userInfoThreadWorking: true
        })

        var param = {
            user_id: this.userId,
            user_token: this.token,
            timestamp: new Date().getTime()
        }

        // show progress dialog
        // this.showProgress()

        console.log('client --> server(userinfo): ', param)

        CIMAService.sendPostRequestAsync(Api.USERINFO, param, this.userInfoSuccess, this.userInfoFailed )
    }

    showModal = () => this.setState({ isModalVisible: true })    
    hideModal = () => this.setState({ isModalVisible: false })

    showProgress = () => this.setState({ isProgressVisible: true })    
    hideProgress = () => this.setState({ isProgressVisible: false })

    goPurchasePage() {
        this.props.navigator.push({
            screen: 'Main.PurchasePage'
        });
    }

    goSettingPage() {
        this.props.navigator.push({
            screen: 'Main.SettingsPage'
        });
    }

    goPassInOutPage( _pass ) {
        var pass = {
            ..._pass
        }

        if (!pass.available) {
            return
        }

        if (pass.type == Api.PROMOPASS_TYPE) {

            if ( this.props.seasonPassInfo.used || this.props.dayPassInfo.used || this.props.multiPassInfo.used ) {
                return
            }
        }

        if (pass.type == Api.SEASONPASS_TYPE) {

            if ( this.props.promoPassInfo.used || this.props.dayPassInfo.used || this.props.multiPassInfo.used ) {
                return
            }

            // return if the start date of season pass is greater than today
            var startDate = new Date(pass.from)
            var today = new Date()
            today.setHours(0, 0, 0, 0)
            if ( startDate > today ) {
                this.refs.toast.show('The pass will be available from ' + dateFormat(new Date(pass.from), "dd mmm yyyy"));
                return
            }
        }

        if (pass.type == Api.DAYPASS_TYPE) {

            if ( this.props.promoPassInfo.used || this.props.seasonPassInfo.used || this.props.multiPassInfo.used ) {
                return
            }
        }

        if (pass.type == Api.MULTIPASS_TYPE) {

            if ( this.props.promoPassInfo.used || this.props.seasonPassInfo.used || this.props.dayPassInfo.used ) {
                return
            }
        }

        if ( pass.used ) {
            this.props.navigator.push({
                screen: 'Passes.QRCodePage',
                passProps: {
                    baseUrl: Api.GYMOUT,
                    userId: this.userId,
                    timestamp: new Date().getTime(),
                    pass,
                    userToken: this.token,
                    popNum: 1
                }
            });
        } else {
            this.props.navigator.push({
                screen: 'Passes.PassInOutPage',
                passProps: {
                    pass,
                    popNum: 2
                }
            });
        }
    }

    openImagePicker( e ) {        
        var options = {
            title: 'Select photo',
            storageOptions: {
				skipBackup: true,
				path: 'images'
            },
            mediaType: 'photo'
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
                // let source = { uri: response.uri};
                // this.setState({
                //     avatarSource: source
                // });
                // console.log(this.state.avatarSource.uri);
            }
		});
    }

    closeAlert = () => {
        this.hideModal()
        Storage.setFirstLogin( 'false' )
    }

    onAvatarError = () => {
        var personalInfo = {
            avatarUri: '',
            firstName: this.props.personalInfo.firstName,
            lastName: this.props.personalInfo.lastName,
            phoneNumber: this.props.personalInfo.phoneNumber,
        }

        this.props.actions.personalInfoChanged( personalInfo )
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let closeImage = require('../assets/images/close-circle.png');
        let checkImage = require('../assets/images/check-circle.png');

        const { personalInfo, multiPassInfo, promoPassInfo, dayPassInfo, seasonPassInfo, validPromoDate } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* avatar */}
                    <View style={ [ style.avatarContainer,] } >
                        <View style={style.avatarImage}>
                            {/* <TouchableOpacity onPress={() => this.openImagePicker() }> */}
                                { 
                                    personalInfo == undefined || personalInfo.avatarUri == '' ?
                                    <Icon name="user"
                                        type="entypo"
                                        size={ moderateScale(45)}
                                        color="#d8d8d8"
                                    />
                                        :
                                    <Image 
                                        style={style.avatarImage} 
                                        source={ {uri: personalInfo.avatarUri} } 
                                        onError={ this.onAvatarError }
                                    />
                                }
                            {/* </TouchableOpacity> */}
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        <View style={ [Styles.stretch, style.avatarInfoContainer] }>
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont] }>{personalInfo == undefined? '':personalInfo.firstName} {personalInfo == undefined? '':personalInfo.lastName}</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont] }>{personalInfo == undefined? '':personalInfo.phoneNumber}</Text>
                        </View>
                    </View>

                    {/* space */}
                    <View style={ [Styles.middleSpace] } />

                    {/* pass container */}
                    <View style={ [style.container] } >
                        {/* season & multi pass */}
                        <View style={[style.passContainer, Styles.stretch]}>
                            {/* season pass */}
                            <View style={ [style.container] }>
                                <Button
                                    textStyle={ [ Styles.largeFont, Styles.whiteColor, Styles.smallPadding] }                    
                                    style={[Styles.stretch, seasonPassInfo != undefined && seasonPassInfo.available? style.passActiveButton : style.passInactiveButton]}
                                    onPress={() => this.goPassInOutPage( seasonPassInfo )}
                                    activeOpacity={seasonPassInfo != undefined && seasonPassInfo.available? 0.5:1} >
                                    SEASON PASS
                                </Button>
                                <View style={[Styles.iconBadge, seasonPassInfo != undefined && seasonPassInfo.used? Styles.visible : Styles.hidden]}>
                                    <Image source={ checkImage } style={style.passUsed} /> 
                                </View>
                            </View>
                            
                            {/* space */}
                            <View style={ [Styles.normalSpace] } />

                            {/* multi pass */}
                            <View style={style.container}>
                                <Button
                                    textStyle={ [Styles.largeFont, Styles.whiteColor, Styles.smallPadding] }                    
                                    style={[Styles.stretch, multiPassInfo != undefined && multiPassInfo.available? style.passActiveButton : style.passInactiveButton]}
                                    onPress={() => this.goPassInOutPage( multiPassInfo )} 
                                    activeOpacity={multiPassInfo != undefined && multiPassInfo.available? 0.5:1} >
                                    MULTI PASS
                                </Button>
                            </View>
                            <View style={[Styles.iconBadge, multiPassInfo != undefined && multiPassInfo.used? Styles.visible : Styles.hidden]}>
                                <Image source={ checkImage } style={style.passUsed} /> 
                            </View>
                        </View>

                        {/* space */}
                        <View style={ [Styles.smallSpace] } />

                        {/* day & promo pass */}
                        <View style={[style.passContainer, Styles.stretch]}>
                            {/* day pass */}
                            <View style={ [style.container] }>
                                <Button
                                    textStyle={ [ Styles.largeFont, Styles.whiteColor, Styles.smallPadding] }                    
                                    style={[Styles.stretch, dayPassInfo != undefined && dayPassInfo.available? style.passActiveButton : style.passInactiveButton]}
                                    onPress={() => this.goPassInOutPage( dayPassInfo )} 
                                    activeOpacity={dayPassInfo != undefined && dayPassInfo.available? 0.5:1} >
                                    DAY PASS
                                </Button>
                                <View style={[Styles.iconBadge, dayPassInfo != undefined && dayPassInfo.used? Styles.visible : Styles.hidden]}>
                                    <Image source={ checkImage } style={style.passUsed} /> 
                                </View>
                            </View>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />

                            {/* promo pass */}
                            <View style={style.container}>
                                <Button
                                    textStyle={ [Styles.largeFont, Styles.whiteColor, Styles.smallPadding] }                    
                                    style={[Styles.stretch, promoPassInfo != undefined && promoPassInfo.available? style.passActiveButton : style.passInactiveButton]}
                                    onPress={() => this.goPassInOutPage( promoPassInfo )} 
                                    activeOpacity={promoPassInfo != undefined && promoPassInfo.available? 0.5:1} >
                                    PROMO PASS
                                </Button>
                                <View style={[Styles.iconBadge, promoPassInfo != undefined && promoPassInfo.used? Styles.visible : Styles.hidden]}>                                    
                                    <Image source={ checkImage } style={style.passUsed} />                                    
                                </View>
                            </View>                        
                        </View>
                    </View>

                    {/* space */}
                    <View style={ [Styles.middleSpace] } />

                    {/* buy button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.goPurchasePage()} >
                        BUY
                    </Button>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* setting button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.goSettingPage()} >
                        SETTINGS
                    </Button>
                    
                    {/* modal dialog */}
                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={ [style.container, ] }>
                            {/* alertView */}
                            <View style={ [style.alertView,] } >
                                <View style={ [style.alertContent, Styles.normalPadding] } >
                                    <Text style={[style.alertTitleText, Styles.middleFont]}>Hello {personalInfo == undefined? '':personalInfo.firstName},</Text>
                                    
                                    {/* space */}
                                    <View style={ [Styles.smallSpace] } />
                                    
                                    <Text style={[style.alertContentText, Styles.middleFont]}>Welcome to BoulderWorld! Under “Settings”, please fill up the rest of your info to get one free pass! Valid only until {validPromoDate}.</Text>
                                </View>

                                <View style={[Styles.iconBadge]}>
                                    <TouchableOpacity style={{flex: 1}} key={1} onPress={() => this.closeAlert() }>
                                        <Image source={ closeImage } style={style.closeImage} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </View>
                    </Modal> 

                    {/* progress dialog */}
                    <Modal isVisible={this.state.isProgressVisible}>
                        <View style={ [Styles.centerInColumn, ] }>
                            <ProgressBar />
                        </View>
                    </Modal>

                    <Toast ref="toast"/>
                </View>
            </ImageBackground>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    avatarInfoContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: moderateScale(50)
    },
    avatarImage: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderWidth: moderateScale(2),
        borderColor: '#d8d8d8',
        borderRadius: moderateScale(30),
        justifyContent: 'center',
        alignItems: 'center'
    },
    passContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    passInactiveButton: {
        backgroundColor: '#d8d8d8',
        borderColor: '#d8d8d8'
    },
    passActiveButton: {
        backgroundColor: '#5EC3AE',
        borderColor: '#5EC3AE'
    }, 
    alertView: {
        height: moderateScale(180),
        width: moderateScale(250),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContent: {
        height: moderateScale(170),
        width: moderateScale(240),
        borderRadius: moderateScale(5),
        backgroundColor: '#F9AD51',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertTitleText: {
        alignSelf: 'stretch',
        color: 'white'
    },
    alertContentText: {
        flex: 1,
        alignSelf: 'stretch',
        color: 'white'
    },
    closeImage: {
        height: moderateScale(28),
        width: moderateScale(28)
    },
    passUsed: {
        height: moderateScale(28),
        width: moderateScale(28)
    }
})

HomePage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

HomePage.propTypes = {
	actions: PropTypes.object.isRequired,
    personalInfo: PropTypes.object.isRequired,
    promoPassInfo: PropTypes.object,
    multiPassInfo: PropTypes.object,
    seasonPassInfo: PropTypes.object,
    dayPassInfo: PropTypes.object,
    validPromoDate: PropTypes.string,
    userInfoThreadWorking: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
    return {
        personalInfo: state.cima.personalInfo,
        promoPassInfo: state.cima.promoPassInfo,
        multiPassInfo: state.cima.multiPassInfo,
        seasonPassInfo: state.cima.seasonPassInfo,
        dayPassInfo: state.cima.dayPassInfo,
        validPromoDate: state.cima.validPromoDate,
        userInfoThreadWorking: state.cima.userInfoThreadWorking
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);