import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform
} from 'react-native';

import Button from 'apsl-react-native-button'
import ShoppingItem from '../Widgets/ShoppingItem'
import { Icon } from 'react-native-elements'

import Styles from '../assets/styles/styles';

import stripe from 'tipsi-stripe'
import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar';
import { Navigation } from 'react-native-navigation'

import * as Storage from '../Helper/Storage'
import * as Configuration from '../constants/configuration'
import * as Util from '../Helper/Util'

import Toast, {DURATION} from 'react-native-easy-toast'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import dateFormat from 'dateformat'
import { SEASONPASS_TYPE } from '../constants/api';

import firebase from 'react-native-firebase';

stripe.init({
    publishableKey: 'pk_test_XKZpjGWsIcFoykT8ygLL44HQ',
    // publishableKey: 'pk_live_9xcu8a8NlUhPOunQK3pYVNGS',
    merchantId: '',
    androidPayMode: 'test',
})

class CartPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            isProgressVisible: false,
        }

        this.checkoutSuccess = this.checkoutSuccess.bind(this)
        this.checkoutFailed = this.checkoutFailed.bind(this)
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.token = await Storage.getToken()
        this.passesInfo = JSON.parse( await Storage.getPasses() )
        this.email = await Storage.getEmail()
        
        passCart = JSON.parse(await Storage.getPassCart())
        shoeCart = JSON.parse(await Storage.getShoeCart())
        sockCart = JSON.parse(await Storage.getSockCart())
        gearCart = JSON.parse(await Storage.getGearCart())

        // pass cart
        this.props.actions.passCartChanged( passCart )

        // shoe cart
        this.props.actions.shoeCartChanged( shoeCart )

        // sock cart
        this.props.actions.sockCartChanged( sockCart )

        // Gear cart
        this.props.actions.gearCartChanged( gearCart )

        this.updateTotalPrice(passCart, shoeCart, sockCart, gearCart)
    }

    updateTotalPrice(passCart, shoeCart, sockCart, gearCart) {
        var totalPrice = 0

        passCart.map((item, i) => {
            totalPrice += item.budget
        })

        shoeCart.map((item, i) => {
            totalPrice += item.budget
        })

        totalPrice += sockCart.budget

        totalPrice += gearCart.budget

        this.props.actions.totalPriceChanged( totalPrice )
    }

    checkoutSuccess(res) {
        console.log( 'server --> client(checkout success): ', res.data )

        if (res.data.result === Api.OK) {
            this.hideProgress()

            var items = []

            this.props.shoeCart.map((item, i) => {
                items = [
                    ...items,
                    {
                        product: item.infoValue + ' ' + item.productName,
                        quantity: item.quantity
                    }
                ]
            })

            if (this.props.sockCart.type != undefined) {
                items = [
                    ...items,
                    {
                        product: this.props.sockCart.productName,
                        quantity: this.props.sockCart.quantity
                    }
                ]
            }

            if (this.props.gearCart.type != undefined) {
                items = [
                    ...items,
                    {
                        product: this.props.gearCart.productName,
                        quantity: this.props.gearCart.quantity
                    }
                ]
            }

            // reset carts
            Storage.setPassCart()
            Storage.setShoeCart()
            
            value = {
                category: Configuration.CATEGORY_SOCKS,
                productName: 'Sock Rental',
                budget: 0,
                billUnit: 'SGD',
                infoKey: 'Size',
                infoValue: 'FREE',
                quantity: 0
            }
            Storage.setSockCart( JSON.stringify(value) )

            value = {
                category: Configuration.CATEGORY_GEAR,
                productName: 'Gear Rental',
                budget: 0,
                billUnit: 'SGD',
                infoKey: 'Size',
                infoValue: 'FREE',
                quantity: 0
            }
            Storage.setGearCart( JSON.stringify(value) )

            // update pass status in home page and storage
            this.props.passCart.map((_item, i) => {
                var passInfo = {}

                index = Util.getIndex( _item.type, this.passesInfo, 'type' )
                if (index < 0) { // append
                    passInfo = {
                        ...passInfo,
                        type: _item.type,
                        from: _item.from,
                        to: _item.to,
                        available: true,
                        used: false,
                        quantity: _item.quantity
                    }

                    this.passesInfo = Util.appendItem(this.passesInfo, passInfo)
                    
                } else { // update
                    passInfo = {
                        ...passInfo,
                        type: _item.type,
                        from: this.passesInfo[index].from,
                        to: _item.to,
                        available: true,
                        used: this.passesInfo[index].used,
                        quantity: this.passesInfo[index].quantity + _item.quantity
                    }

                    var action = {
                        index,
                        item: {
                            ...passInfo
                        }
                    }

                    this.passesInfo = Util.updateObjectInArray(this.passesInfo, action)
                }

                Storage.setPasses( JSON.stringify(this.passesInfo) )
    
                switch (_item.type) {
                    case Api.SEASONPASS_TYPE: 
                        this.props.actions.seasonPassChanged( passInfo )
                        break;
                    case Api.MULTIPASS_TYPE: 
                        this.props.actions.multiPassChanged( passInfo )
                        break;
                    case Api.DAYPASS_TYPE: 
                        this.props.actions.dayPassChanged( passInfo )
                        break;
                    case Api.PROMOPASS_TYPE: 
                        this.props.actions.promoPassChanged( passInfo )
                        break;
                }
            })

            this.props.navigator.push({
                screen: 'Utils.PaymentSuccessPage',
                passProps: {
                    items,
                    popNum: this.props.popNum + 1
                }
            });
        } else if (res.data.result === Api.FAILED) {
            this.hideProgress()
            this.refs.toast.show( res.data.message );
        } else { // token is old
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

    checkoutFailed(err) {
        console.log( 'server --> client(checkout failed): ', err )

        this.hideProgress()
        this.refs.toast.show('Opps there has been some issue with our server, please try again later.');
    }

    showProgress() {
        this.setState({ isProgressVisible: true })
    }
    
    hideProgress() {
        this.setState({ isProgressVisible: false })
    }

    goPassInOutPage() {
        this.props.navigator.push({
            screen: 'Passes.PassInOutPage'
        });
    }

    continueShopping() {
        for(var i = 0; i < this.props.popNum; i++) {
            this.props.navigator.pop( {animated: false,} );
        } 
    }

    doCheckout() {
        // this.showProgress()

        //     var checkout = []
        //     this.props.passCart.map((item, i) => {
        //         var from = 0
        //         var to = 0

        //         if (item.type == Api.SEASONPASS_TYPE) {
        //             from = new Date(item.infoValue).getTime()
        //         } else if ( item.type == Api.MULTIPASS_TYPE ) {
        //             passAvailableDate = new Date()
        //             from = passAvailableDate.getTime()

        //             // multi pass is available until 6 month
        //             passAvailableDate.setMonth( passAvailableDate.getMonth() + 12 )
        //             to = passAvailableDate.getTime()
        //         } else if (item.type == Api.DAYPASS_TYPE) {
        //             passAvailableDate = new Date()
        //             from = passAvailableDate.getTime()

        //             // multi pass is available until 6 days
        //             passAvailableDate.setDate( passAvailableDate.getDate() + 7 )
        //             to = passAvailableDate.getTime()
        //         }

        //         var param = {
        //             type: 'pass',
        //             pass_type: item.type,
        //             from,
        //             to,
        //             quantity: item.quantity
        //         }

        //         if ( item.count != undefined ) {
        //             param = {
        //                 ...param,
        //                 count: item.count
        //             }
        //         }

        //         checkout = [
        //             ...checkout,
        //             param
        //         ]
        //     })

        //     this.props.shoeCart.map((item, i) => {
        //         checkout = [
        //             ...checkout,
        //             {
        //                 type: 'gear',
        //                 gear_type: item.type,
        //                 shoe_size: item.infoValue,
        //                 quantity: item.quantity
        //             }
        //         ]
        //     })

        //     if (this.props.sockCart.type != undefined) {
        //         checkout = [
        //             ...checkout,
        //             {
        //                 type: 'gear',
        //                 gear_type: this.props.sockCart.type,
        //                 sock_size: this.props.sockCart.infoValue,
        //                 quantity: this.props.sockCart.quantity
        //             }
        //         ]
        //     }

        //     if (this.props.gearCart.type != undefined) {
        //         checkout = [
        //             ...checkout,
        //             {
        //                 type: 'gear',
        //                 gear_type: this.props.gearCart.type,
        //                 // gear_size: this.props.gearCart.infoValue,
        //                 quantity: this.props.gearCart.quantity
        //             }
        //         ]
        //     }

        //     index = Util.getIndex( Api.SEASONPASS_TYPE, this.props.passCart, 'type' )
        //     var seasonPrice = 0
        //     if (index > -1) {
        //         seasonPrice = this.props.passCart[index].budget
        //     }
            
        //     var param = {
        //         user_id: this.userId,
        //         email: this.email,
        //         user_token: this.token,
        //         stripe_token: 'res.tokenId',
        //         stripe_customerid: 'res.card.cardId',
        //         currency: 'SGD',
        //         total_price: (this.props.totalPrice - seasonPrice) * 100,
        //         timestamp: new Date().getTime(),
        //         checkout
        //     }
            
        //     console.log( 'client --> server: ', param )

        //     CIMAService.sendPostRequestAsync(Api.CHECKOUT, param, this.checkoutSuccess, this.checkoutFailed )
        //     return

        if ( this.props.totalPrice < 1 ) {
            this.refs.toast.show( "Cart is empty." );
            return
        }

        const options = {
            smsAutofillDisabled: true
        }
          
        stripe.paymentRequestWithCardForm( options )
        .then( ( res ) => {
            this.showProgress()

            var checkout = []
            this.props.passCart.map((item, i) => {
                var from = 0
                var to = 0

                if (item.type == Api.SEASONPASS_TYPE) {
                    from = new Date(item.infoValue).getTime()
                } else if ( item.type == Api.MULTIPASS_TYPE ) {
                    passAvailableDate = new Date()
                    from = passAvailableDate.getTime()

                    // multi pass is available until 6 month
                    passAvailableDate.setMonth( passAvailableDate.getMonth() + 12 )
                    to = passAvailableDate.getTime()
                } else if (item.type == Api.DAYPASS_TYPE) {
                    passAvailableDate = new Date()
                    from = passAvailableDate.getTime()

                    // multi pass is available until 6 days
                    passAvailableDate.setDate( passAvailableDate.getDate() + 7 )
                    to = passAvailableDate.getTime()
                }

                var param = {
                    type: 'pass',
                    pass_type: item.type,
                    from,
                    to,
                    quantity: item.quantity
                }

                if ( item.count != undefined ) {
                    param = {
                        ...param,
                        count: item.count
                    }
                }

                checkout = [
                    ...checkout,
                    param
                ]
            })

            this.props.shoeCart.map((item, i) => {
                checkout = [
                    ...checkout,
                    {
                        type: 'gear',
                        gear_type: item.type,
                        shoe_size: item.infoValue,
                        quantity: item.quantity
                    }
                ]
            })

            if (this.props.sockCart.type != undefined) {
                checkout = [
                    ...checkout,
                    {
                        type: 'gear',
                        gear_type: this.props.sockCart.type,
                        sock_size: this.props.sockCart.infoValue,
                        quantity: this.props.sockCart.quantity
                    }
                ]
            }

            if (this.props.gearCart.type != undefined) {
                checkout = [
                    ...checkout,
                    {
                        type: 'gear',
                        gear_type: this.props.gearCart.type,
                        // gear_size: this.props.gearCart.infoValue,
                        quantity: this.props.gearCart.quantity
                    }
                ]
            }

            index = Util.getIndex( Api.SEASONPASS_TYPE, this.props.passCart, 'type' )
            var seasonPrice = 0
            if (index > -1) {
                seasonPrice = this.props.passCart[index].budget
            }

            var param = {
                user_id: this.userId,
                user_token: this.token,
                email: this.email,
                stripe_token: res.tokenId,
                stripe_customerid: res.card.cardId,
                currency: 'SGD',
                total_price: (this.props.totalPrice - seasonPrice) * 100,
                timestamp: new Date().getTime(),
                checkout
            }
            
            console.log( 'client --> server: ', param )

            CIMAService.sendPostRequestAsync(Api.CHECKOUT, param, this.checkoutSuccess, this.checkoutFailed )
        } )
        .catch( (error) => {
            
        });
        
    }

    delete = (category, index) => {
        if (category == Configuration.CATEGORY_PASS) {
            var action = {
                index
            }

            var updatedCart = Util.removeItem(this.props.passCart, action)
            
            Storage.setPassCart( JSON.stringify(updatedCart) )
            this.props.actions.passCartChanged( updatedCart )
            this.updateTotalPrice(updatedCart, this.props.shoeCart, this.props.sockCart, this.props.gearCart)
        } else if (category == Configuration.CATEGORY_SHOES) {
            var action = {
                index
            }

            var updatedCart = Util.removeItem(this.props.shoeCart, action)

            Storage.setShoeCart( JSON.stringify(updatedCart) )
            this.props.actions.shoeCartChanged( updatedCart )
            this.updateTotalPrice(this.props.passCart, updatedCart, this.props.sockCart, this.props.gearCart)
        } else if (category == Configuration.CATEGORY_SOCKS) {
            var updatedCart = {
                category: Configuration.CATEGORY_SOCKS,
                productName: 'Sock Rental',
                budget: 0,
                billUnit: 'SGD',
                infoKey: 'Size',
                infoValue: 'FREE',
                quantity: 0
            }

            Storage.setSockCart( JSON.stringify(updatedCart) )
            this.props.actions.sockCartChanged( updatedCart )
            this.updateTotalPrice(this.props.passCart, this.props.shoeCart, updatedCart, this.props.gearCart)
        } else if (category == Configuration.CATEGORY_GEAR) {
            var updatedCart = {
                category: Configuration.CATEGORY_GEAR,
                productName: 'Gear Rental',
                budget: 0,
                billUnit: 'SGD',
                infoKey: 'Size',
                infoValue: 'FREE',
                quantity: 0
            }

            Storage.setGearCart( JSON.stringify(updatedCart) )
            this.props.actions.gearCartChanged( updatedCart )
            this.updateTotalPrice(this.props.passCart, this.props.shoeCart, this.props.sockCart, updatedCart)
        }
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

        const { 
            passCart,
            shoeCart,
            sockCart,
            gearCart,
            totalPrice
        } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>CART</Text>
                    </View>

                    {/* space */}
                    <View style={ [Styles.middleSpace] } />

                    <View style={[ style.cartContainer, totalPrice > 1? Styles.hidden:Styles.visible ]}>
                        <Icon name="cart"
                            type="zocial"
                            size={180}
                            color="#696969"
                            containerStyle={[ style.cart ]}
                            iconStyle={ {opacity: 0.3,  flex: 1} }
                        />
                    </View>

                    {/* Cart Item */}
                    <ScrollView style={ [style.scrollView, totalPrice < 1? Styles.hidden:Styles.visible] } >
                        {passCart.map((item, i) => 
                            <ShoppingItem
                                key={i}
                                category={ item.category }
                                index = { i }
                                productName={ item.productName }
                                budget={ item.budget }
                                billUnit={ item.billUnit }
                                infoKey={item.infoKey}
                                infoValue={item.infoValue}
                                quantity={item.quantity}
                                delete={this.delete}
                            />
                        )}


                        {shoeCart.map((item, i) => 
                            <ShoppingItem
                                key={i}
                                category={ item.category }
                                index = { i }
                                productName={ item.productName }
                                budget={ item.budget }
                                billUnit={ item.billUnit }
                                infoKey={item.infoKey}
                                infoValue={item.infoValue}
                                quantity={item.quantity}
                                delete={this.delete}
                            />
                        )}

                        <ShoppingItem
                            category={ sockCart.category }
                            index = { 0 }
                            productName={ sockCart.productName }
                            budget={ sockCart.budget }
                            billUnit={ sockCart.billUnit }
                            infoKey={sockCart.infoKey}
                            infoValue={sockCart.infoValue}
                            quantity={sockCart.quantity}
                            delete={this.delete}
                            style={sockCart.quantity < 1? Styles.hidden : Styles.visible}
                        />

                        <ShoppingItem
                            category={ gearCart.category }
                            index = { 0 }
                            productName={ gearCart.productName }
                            budget={ gearCart.budget }
                            billUnit={ gearCart.billUnit }
                            infoKey={gearCart.infoKey}
                            infoValue={gearCart.infoValue}
                            quantity={gearCart.quantity}
                            delete={this.delete}
                            style={gearCart.quantity < 1? Styles.hidden : Styles.visible}
                        />

                        {/* subtotal */}
                        <View style={[style.productNameContainer, totalPrice < 1? Styles.hidden : Styles.visible]}>
                            <Text style={ [ Styles.middleFont, Styles.darkGreenColor, Styles.stretch3X, Styles.textAlignRight] }>SUBTOTAL:</Text>
                            <Text style={ [ Styles.middleFont, Styles.redColor, Styles.stretch2X, Styles.textAlignRight] }>SGD {totalPrice}</Text>
                        </View>
                    </ScrollView>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* home button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton,]}
                        activeOpacity={0.5}
                        onPress={() => this.continueShopping()} >
                        CONTINUE SHOPPING
                    </Button>

                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton,]}
                        activeOpacity={0.5}
                        onPress={() => this.doCheckout()} >
                        CHECK OUT
                    </Button>
                </View>

                <Toast ref="toast"/>

                {/* progress dialog */}
                <Modal isVisible={this.state.isProgressVisible}>
                    <View style={ [Styles.centerInColumn, ] }>
                        <ProgressBar />
                    </View>
                </Modal>
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
    passInactiveButton: {
        backgroundColor: '#d8d8d8',
        borderColor: '#d8d8d8',
    },
    passActiveButton: {
        backgroundColor: '#5EC3AE',
        borderColor: '#5EC3AE',
    },
    productNameContainer: {
        height: 50,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    cartContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 200
    },
    cart: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch'
    }
})

CartPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
}

CartPage.propTypes = {
    actions: PropTypes.object.isRequired,
    passCart: PropTypes.array,
    shoeCart: PropTypes.array,
    sockCart: PropTypes.object,
    gearCart: PropTypes.object,
    totalPrice: PropTypes.number
};

function mapStateToProps(state, ownProps) {
    return {
        passCart: state.cima.passCart,
        shoeCart: state.cima.shoeCart,
        sockCart: state.cima.sockCart,
        gearCart: state.cima.gearCart,
        totalPrice: state.cima.totalPrice
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);