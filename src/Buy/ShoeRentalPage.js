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
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import * as Storage from '../Helper/Storage'
import * as Configuration from '../constants/configuration'
import * as Util from '../Helper/Util'
import * as Api from '../constants/api'

import * as CIMAService from '../Helper/CIMAService'

import firebase from 'react-native-firebase';

class ShoeRentalPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            shoeSize: '',
            isProgressVisible: false,
            price: 0
        }

        this.shoeSizeSelected = this.shoeSizeSelected.bind(this)
        this.goCartPage = this.goCartPage.bind(this)
        this.addToCart = this.addToCart.bind(this)
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.userToken = await Storage.getToken()

        var item = JSON.parse(await Storage.getShoeCart())
        this.props.actions.shoeCartChanged( item )

        this.passCart = JSON.parse(await Storage.getPassCart())

        var param = {
            user_id: this.userId,
            user_token: this.userToken,
            type: Api.SHOE_TYPE
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

            var equipment = []

            this.setState({
                price: res.data.detail.price
            })

            if ( res.data.detail.quantity < 1 ) {
                this.refs.toast.show('There are no shoes available.');
                return
            }

            res.data.detail.size.map((item, i) => {
                if ( item.quantity < 1 ) {
                    return
                }
                equipment = Util.appendItem( equipment, { value: item }, )
            })

            this.props.actions.equipmentChanged( equipment )
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
        if ( this.props.shoeCart != null && this.props.shoeCart.length > 0) {
            Storage.setShoeCart( JSON.stringify(this.props.shoeCart) )
        }

        this.setState({
            shoeSize: ''
        })

        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

    shoeSizeSelected = ( size ) => {
        if (size == null || size == '') {
            return
        }

        lastIndex = Util.getIndex( this.state.shoeSize, this.props.shoeCart, 'infoValue' )

        if (this.state.shoeSize == size && lastIndex > -1) {
            return
        }
        
        var updatedCart = [...this.props.shoeCart]

        if ( lastIndex > -1 && this.props.shoeCart[lastIndex].quantity < 2 ) {
            var action = {
                index: lastIndex
            }

            updatedCart = Util.removeItem(this.props.shoeCart, action)
        } else if ( lastIndex > -1 && this.props.shoeCart[lastIndex].quantity > 1 ) {
            var action = {
                index: lastIndex,                
                item: {
                    category: Configuration.CATEGORY_SHOES,
                    type: Api.SHOE_TYPE,
                    productName: 'Shoe Rental',
                    budget: this.props.shoeCart[lastIndex].budget - this.state.price,
                    billUnit: 'SGD',
                    infoKey: 'Size',
                    infoValue: this.state.shoeSize,
                    quantity: this.props.shoeCart[lastIndex].quantity - 1
                }
            }

            updatedCart = Util.updateObjectInArray(this.props.shoeCart, action)
        }

        var newCart = []

        newIndex = Util.getIndex( size, updatedCart, 'infoValue' )

        if ( newIndex > -1 ) { // there's same size in cart
            var action = {
                index: newIndex,                
                item: {
                    category: Configuration.CATEGORY_SHOES,
                    type: Api.SHOE_TYPE,
                    productName: 'Shoe Rental',
                    budget: updatedCart[newIndex].budget + this.state.price,
                    billUnit: 'SGD',
                    infoKey: 'Size',
                    infoValue: size,
                    quantity: updatedCart[newIndex].quantity + 1
                }
            }

            newCart = Util.updateObjectInArray(updatedCart, action)
        } else { // there's no any same size in cart
            var item = {
                category: Configuration.CATEGORY_SHOES,
                type: Api.SHOE_TYPE,
                productName: 'Shoe Rental',
                budget: this.state.price,
                billUnit: 'SGD',
                infoKey: 'Size',
                infoValue: size,
                quantity: 1
            }
            
            newCart = Util.appendItem( updatedCart, item )
        }

        this.setState({
            shoeSize: size
        })

        this.props.actions.shoeCartChanged( newCart )
    }

    addToCart() {
        if ( this.props.shoeCart == null || this.props.shoeCart.length < 1) {
            this.refs.toast.show('Please choose your shoe size.')
            return    
        }

        if ( Util.getIndex( Api.SEASONPASS_TYPE, this.passCart, 'type' ) > -1 ) {
            this.refs.toast.show('It cannot be purchased together with season pass')
            return
        }

        Storage.setShoeCart( JSON.stringify(this.props.shoeCart) )

        this.setState({
            shoeSize: ''
        })
        
        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

    removeItem = (i) => {
        var action = {
            index: i
        }

        updatedCart = Util.removeItem(this.props.shoeCart, action)
        this.props.actions.shoeCartChanged( updatedCart )
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let shoeImage = require('../assets/images/shoe.png');
        let cartImage = require('../assets/images/cart.png');

        const { 
            shoeCart,
            equipment
        } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>SHOES RENTAL</Text>

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
                            <Image source={shoeImage} style={style.passImage} resizeMode='contain' />

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>Climbing shoes have to be worn whenever a climber is on the wall. Shoes are meant to fit snugly, to aid the climbers step on small footholds. While slight discomfort is common for first timers, climbers are advised to put on a pair that they can bear to put on, for at least 30 minutes. <Text style={ [Styles.redColor, Styles.smallFont,] }>${this.state.price}</Text></Text>
                            
                            <View style={ style.dropDownComponentContainer }>
                                <Dropdown
                                    textColor = '#5EC3AE'
                                    baseColor = '#5EC3AE'
                                    onChangeText={this.shoeSizeSelected}
                                    label='Select shoe size'
                                    data={equipment}
                                    value={this.state.shoeSize}
                                    containerStyle={style.dropdownContainer}
                                    fontSize={ moderateScale(16) }
                                    labelFontSize={ moderateScale(12) }
                                />
                            </View>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />

                            {/* Quantity table */}
                            <View style={[style.container, shoeCart.length > 0? Styles.visible : Styles.hidden]}>
                                {/* header */}
                                <View style={Styles.centerInRow}>
                                    <Text style={ [Styles.lightGrayColor, Styles.smallFont, Styles.stretch3X, Styles.textAlignLeft] }>Chosen</Text>
                                    <Text style={ [Styles.lightGrayColor, Styles.smallFont, Styles.stretch2X, Styles.textAlignCenter] }>Qty</Text>
                                    <Text style={ [Styles.lightGrayColor, Styles.smallFont, Styles.stretch, ] }></Text>
                                </View>

                                {shoeCart.map((item, i) => 
                                    <ShoeItem 
                                        key={i}
                                        index={i}
                                        size={item.infoValue}
                                        quantity={item.quantity}
                                        removeItem ={ this.removeItem }
                                    />
                                )}

                                {/* space */}
                                <View style={ [Styles.smallSpace] } />
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

ShoeRentalPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

ShoeRentalPage.propTypes = {
    actions: PropTypes.object.isRequired,
    shoeCart: PropTypes.array,
    equipment: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        shoeCart: state.cima.shoeCart,
        equipment: state.cima.equipment
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoeRentalPage);