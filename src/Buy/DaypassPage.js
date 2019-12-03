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
import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import * as Storage from '../Helper/Storage'
import * as Configuration from '../constants/configuration'
import * as Util from '../Helper/Util'
import * as Api from '../constants/api'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import * as CIMAService from '../Helper/CIMAService'

import firebase from 'react-native-firebase';

class DaypassPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            price: 0
        }

        this.goCartPage = this.goCartPage.bind(this)
        this.addToCart = this.addToCart.bind(this)
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.userToken = await Storage.getToken()

        var item = JSON.parse(await Storage.getPassCart())
        this.props.actions.passCartChanged( item )

        var param = {
            user_id: this.userId,
            user_token: this.userToken,
            type: Api.DAYPASS_TYPE
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
        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

    addToCart() {
        if ( Util.getIndex( Api.SEASONPASS_TYPE, this.props.passCart, 'type' ) > -1 ) {
            this.refs.toast.show('This pass cannot be purchased together with season pass')
            return
        }

        // check if season pass was bought
        index = Util.getIndex( Api.DAYPASS_TYPE, this.props.passCart, 'type' )
        if ( index > -1 ) { // update
            var action = {
                index,
                item: {
                    category: Configuration.CATEGORY_PASS,
                    type: Api.DAYPASS_TYPE,
                    productName: 'Day Pass',
                    budget: this.state.price + this.props.passCart[index].budget,
                    billUnit: 'SGD',
                    infoKey: '',
                    infoValue: '',
                    quantity: this.props.passCart[index].quantity + 1
                }
            }
            

            Storage.setPassCart( JSON.stringify(Util.updateObjectInArray(this.props.passCart, action)) )
        } else { // insert
            var item = {
                category: Configuration.CATEGORY_PASS,
                type: Api.DAYPASS_TYPE,
                productName: 'Day Pass',
                budget: this.state.price,
                billUnit: 'SGD',
                infoKey: '',
                infoValue: '',
                quantity: 1,
            }

            Storage.setPassCart( JSON.stringify(Util.appendItem( this.props.passCart, item )) )
        }

        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let daypassImage = require('../assets/images/daypass.png');
        let cartImage = require('../assets/images/cart.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>DAY PASS</Text>

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

                    {/* Day pass */}
                    <ScrollView style={ [style.scrollView] } >
                        <View style={style.container}>
                            {/* pass image */}
                            <Image source={daypassImage} style={style.passImage} resizeMode='contain' />

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>A Day Pass permits entry into the gym for 1 Day. Multiple entries are allowed on that single day.<Text style={ [Styles.redColor, Styles.smallFont] }>${this.state.price}</Text></Text>
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
    dropDownContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    cartImage: {
        width: moderateScale(50),
        height: moderateScale(50)
    }
})

DaypassPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

DaypassPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(DaypassPage);