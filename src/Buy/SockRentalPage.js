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
    Platform
} from 'react-native';

import Button from 'apsl-react-native-button'
import ShoppingItem from '../Widgets/ShoppingItem'
import { Dropdown } from 'react-native-material-dropdown'
import { Icon } from 'react-native-elements';
import ShoeItem from '../Widgets/ShoeItem'
import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'

import Styles from '../assets/styles/styles';

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import * as Storage from '../Helper/Storage'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import * as Configuration from '../constants/configuration';
import * as Util from '../Helper/Util'
import * as Api from '../constants/api'

import * as CIMAService from '../Helper/CIMAService'

import firebase from 'react-native-firebase';

class SockRentalPage extends Component {
	constructor(props) {
        super(props);
        
        this.state = {
            price: 0,
            isProgressVisible: false
        }

        this.goCartPage = this.goCartPage.bind(this)
        this.addToCart = this.addToCart.bind(this)
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.userToken = await Storage.getToken()

        var item = JSON.parse(await Storage.getSockCart())
        this.props.actions.sockCartChanged( item )

        this.passCart = JSON.parse(await Storage.getPassCart())

        var param = {
            user_id: this.userId,
            user_token: this.userToken,
            type: Api.SOCK_TYPE
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
                price: res.data.detail.price
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
        if ( this.props.sockCart != null  ) {
            Storage.setSockCart( JSON.stringify(this.props.sockCart) )
        }

        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

    quantitySelected = ( number ) => {
        var item = {
            category: Configuration.CATEGORY_SOCKS,
            type: Api.SOCK_TYPE,
            productName: 'Sock Rental',
            budget: this.state.price * parseInt( number ),
            billUnit: 'SGD',
            infoKey: 'Size',
            infoValue: 'FREE',
            quantity: parseInt( number )
        }

        this.props.actions.sockCartChanged( item )
    }

    addToCart() {
        if ( this.props.sockCart == null || this.props.sockCart.quantity < 1 ) {
            this.refs.toast.show('Please choose quantity.')
            return    
        }

        if ( Util.getIndex( Api.SEASONPASS_TYPE, this.passCart, 'type' ) > -1 ) {
            this.refs.toast.show('It cannot be purchased together with season pass')
            return
        }

        Storage.setSockCart( JSON.stringify(this.props.sockCart) )

        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let sockImage = require('../assets/images/sock.png');
        let cartImage = require('../assets/images/cart.png');

        const { 
            sockCart
        } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>SOCKS PURCHASE</Text>

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
                    <Text style={ [Styles.redColor, style.budgetText, Styles.middleFont, Styles.textAlignLeft] }>SGD {this.state.price}</Text>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* Cart Item */}
                    <ScrollView style={ [style.scrollView] } >
                        <View style={style.container}>
                            {/* pass image */}
                            <Image source={sockImage} style={style.passImage} resizeMode='contain' />

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>For all rental shoes, it is compulsory for socks to be worn for hygiene purposes. If you did not bring yours today, please get one from our store. <Text style={ [Styles.redColor, Styles.smallFont] }>${this.state.price}</Text></Text>

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />
                            
                            <View style={ style.dropDownComponentContainer }>
                                <Dropdown
                                    textColor = '#5EC3AE'
                                    baseColor = '#5EC3AE'
                                    onChangeText={this.quantitySelected}
                                    label='Quantity'
                                    data={quantityData}
                                    value={sockCart.quantity < 1 ? '':sockCart.quantity.toString()}
                                    containerStyle={style.dropdownContainer}
                                    fontSize={ moderateScale(16) }
                                    labelFontSize={ moderateScale(12) }
                                />
                            </View>
                        </View>
                    </ScrollView>

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
    dropDownComponentContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    dropdownContainer: {
        height: moderateScale(65),
    },
    cartImage: {
        width: moderateScale(50),
        height: moderateScale(50)
    }
})

const quantityData = [
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
    { value: '5' },
];

SockRentalPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

SockRentalPage.propTypes = {
    actions: PropTypes.object.isRequired,
    sockCart: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
    return {
        sockCart: state.cima.sockCart
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SockRentalPage);