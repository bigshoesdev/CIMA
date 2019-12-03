import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform
} from 'react-native';

import Button from 'apsl-react-native-button'
import ShoppingItem from '../Widgets/ShoppingItem'
import { Dropdown } from 'react-native-material-dropdown'
import DatePicker from 'react-native-datepicker'
import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'

import * as Storage from '../Helper/Storage'
import * as Util from '../Helper/Util'
import * as Configuration from '../constants/configuration'
import * as Api from '../constants/api'
import * as CIMAService from '../Helper/CIMAService'

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import firebase from 'react-native-firebase';

class SeasonpassPage extends Component {
	constructor(props) {
        super(props);

        this.state= {
            startDate: '',
            price: 0,
            onetime_fee: 0
        }

        this.email = ''

        this.passesInfo = null

        this.goCartPage = this.goCartPage.bind(this)
        this.addToCart = this.addToCart.bind(this)
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.userToken = await Storage.getToken()

        this.email = await Storage.getEmail()

        var item = JSON.parse(await Storage.getPassCart())
        this.props.actions.passCartChanged( item )

        this.passesInfo = JSON.parse( await Storage.getPasses() )

        this.shoeCart = JSON.parse(await Storage.getShoeCart())
        this.sockCart = JSON.parse(await Storage.getSockCart())
        this.gearCart = JSON.parse(await Storage.getGearCart())

        var param = {
            user_id: this.userId,
            user_token: this.userToken,
            type: Api.SEASONPASS_TYPE
        }

        // show progress dialog
        this.showProgress()

        console.log('client --> server: ', param)

        CIMAService.sendPostRequestAsync(Api.GET_EQUIPMENT, param, this.equipmentSuccess, this.equipmentFailed )
    }

    showProgress = () => this.setState({ isProgressVisible: true })    
    hideProgress = () => this.setState({ isProgressVisible: false })

    equipmentSuccess = (res) => {
        console.log('server --> client(equipment success): ', res.data)

        if (res.data.result == Api.ERROR) {
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
        } else if (res.data.result == Api.OK) {
            this.hideProgress()

            this.setState({
                price: res.data.detail.price,
                onetime_fee: res.data.detail.onetime_fee
            })
        } else {
            this.hideProgress()
            this.refs.toast.show('Service Error');
        }
    }

    equipmentFailed = (err) => {
        console.log('server --> client(equipment failed): ', err)
        this.refs.toast.show('Opps there has been some issue with our server, please try again later.');
    }

    goCartPage() {
        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

    isCartEmpty = () => {
        return this.props.passCart.length < 1 && this.shoeCart.length < 1 && this.sockCart.quantity < 1 && this.gearCart.quantity < 1
    }

    addToCart() {
        if ( this.state.startDate == '' ) {
            this.refs.toast.show('Please select a start date.')
            return    
        }

        if (this.email == '') {
            this.refs.toast.show('You have to set E-mail address.')
            return
        }

        if (!this.isCartEmpty()) {
            this.refs.toast.show('Season pass cannot be purchased together with other items.')
            return
        }

        // check if season pass was bought
        index = Util.getIndex( Api.SEASONPASS_TYPE, this.props.passCart, 'type' )
        if ( index > -1 ) {
            this.refs.toast.show('You have already bought the season pass')
            return
        }

        index = Util.getIndex( Api.SEASONPASS_TYPE, this.passesInfo, 'type' )
        if ( index > -1 ) {
            this.refs.toast.show('You have already bought the season pass')
            return
        }

        var item = {
            category: Configuration.CATEGORY_PASS,
            type: Api.SEASONPASS_TYPE,
            productName: 'Season Pass',
            budget: this.state.price + this.state.onetime_fee,
            billUnit: 'SGD',
            infoKey: 'Start Date',
            infoValue: this.state.startDate,
            quantity: 1
        }

        Storage.setPassCart( JSON.stringify(Util.appendItem( this.props.passCart, item )) )

        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let seasonpassImage = require('../assets/images/seasonpass.png');
        let cartImage = require('../assets/images/cart.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>SEASON PASS</Text>

                        <TouchableOpacity key={1} onPress={() => this.goCartPage() }>
                            <Image 
                                style={style.cartImage}
                                source={cartImage} 
                            />                       
                        </TouchableOpacity> 
                    </View>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* budget */}
                    <Text style={ [Styles.redColor, style.budgetText, Styles.middleFont, Styles.textAlignLeft] }>SGD {this.state.price + this.state.onetime_fee}</Text>
                    <Text style={ [Styles.redColor, style.budgetText, Styles.smallFont, Styles.textAlignLeft] }>(${this.state.price} recurring monthly, after first month)</Text>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* Day pass */}
                    <ScrollView style={ [style.scrollView] } >
                        <View style={style.container}>
                            {/* pass image */}
                            <Image source={seasonpassImage} style={style.passImage} resizeMode='contain' />

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />
                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>There is a one-time activation fee of <Text style={ [Styles.redColor, Styles.smallFont] }>${this.state.onetime_fee}</Text> for the season pass. Monthly membership is at <Text style={ [Styles.redColor, Styles.smallFont] }>${this.state.price}</Text> and can be terminated at any time. At signup, <Text style={ [Styles.redColor, Styles.smallFont] }>${this.state.onetime_fee}</Text> (activation fee) + <Text style={ [Styles.redColor, Styles.smallFont] }>${this.state.price}</Text> (second month fee) + prorated fee for the current month will be collected. Thereafter, the <Text style={ [Styles.redColor, Styles.smallFont] }>${this.state.price}</Text> monthly deduction will occur from the third month.</Text>

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />
                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft, {alignSelf: 'stretch'}] }>No prorated refund is given upon termination. If and when required, the monthly membership can be temporarily frozen at <Text style={ [Styles.redColor, Styles.smallFont] }>$10</Text>/month.</Text>

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />
                            <Text style={ [Styles.redColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>(Season pass cannot be purchased together with other items.)</Text>
                        </View>                        
                    </ScrollView>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* start date */}
                    <View style={style.startDateContainer}>
                        <Text style={ [Styles.redColor, Styles.middleFont,, Styles.textAlignLeft] }>Start Date:</Text>

                        {/* space */}
                        <View style={ [Styles.smallSpace] } />

                        {/* <TextInput 
                            style={ [Styles.stretch, Styles.grayBorder, Styles.verySmallPadding, Styles.lightGrayColor, Styles.smallFont] }
                            underlineColorAndroid='rgba(0,0,0,0)'
                        /> */}
                        <DatePicker
                            date={this.state.startDate}
                            mode="date"
                            format="DD MMM YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            placeholder="Start Date"
                            showIcon={false}
                            style={[Styles.stretch]}
                            customStyles={{
                                dateText: [ Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont, style.dateText],
                                placeholderText: [Styles.middleFont],
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => this.setState({startDate: date})}
                        />
                    </View>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton,]}
                        activeOpacity={0.5}
                        onPress={() => this.addToCart()} >
                        ADD TO CART
                    </Button>

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

    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollView: {
        flex: 1,
        alignSelf: 'stretch',
    },

    productNameContainer: {
        height: moderateScale(50),
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },

    budgetText: {
        alignSelf: 'stretch'
    },

    passImage: {
        flex: 1,
        height: moderateScale(150)
    },

    startDateContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: moderateScale(30),
    },

    cartImage: {
        width: moderateScale(50),
        height: moderateScale(50)
    },

    dateText: {
        alignSelf: 'stretch'
    },
})

SeasonpassPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

SeasonpassPage.propTypes = {
    actions: PropTypes.object.isRequired,
	passCart: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        passCart: state.cima.passCart
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SeasonpassPage);