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

import * as Storage from '../Helper/Storage'
import * as Configuration from '../constants/configuration'
import * as Util from '../Helper/Util'
import * as Api from '../constants/api'
import * as CIMAService from '../Helper/CIMAService'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import firebase from 'react-native-firebase';

class MultipassPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passNumber: '',
            price5: 0,
            price10: 0
        }

        this.goCartPage = this.goCartPage.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.passNumberSelected = this.passNumberSelected.bind(this)
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.userToken = await Storage.getToken()

        var item = JSON.parse(await Storage.getPassCart())
        this.props.actions.passCartChanged( item )

        var param = {
            user_id: this.userId,
            user_token: this.userToken,
            type: Api.MULTIPASS_TYPE
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
                price5: res.data.detail.price5,
                price10: res.data.detail.price10,
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

    passNumberSelected( pass ) {
        this.setState({
            passNumber: pass
        })
    }

    addToCart() {
        if ( this.state.passNumber == '' ) {
            this.refs.toast.show('Please select a pass number.')
            return    
        }

        if ( Util.getIndex( Api.SEASONPASS_TYPE, this.props.passCart, 'type' ) > -1 ) {
            this.refs.toast.show('This pass cannot be purchased together with season pass')
            return
        }

        // check if season pass was bought
        index = Util.getIndex( this.state.passNumber == '5 Passes'? 5 : 10, this.props.passCart, 'count' )
        if ( index > -1 ) { // update
            var action = {
                index,
                item: {
                    category: Configuration.CATEGORY_PASS,
                    type: Api.MULTIPASS_TYPE,
                    count: this.state.passNumber == '5 Passes'? 5 : 10,
                    productName: this.state.passNumber,
                    budget: this.state.passNumber == '5 Passes'? this.state.price5 + this.props.passCart[index].budget : this.state.price10 + this.props.passCart[index].budget,
                    billUnit: 'SGD',
                    infoKey: '',
                    infoValue: '',
                    quantity: 1 + this.props.passCart[index].quantity,
                }
            }

            Storage.setPassCart( JSON.stringify(Util.updateObjectInArray(this.props.passCart, action)) )
        } else { // insert
            var item = {
                category: Configuration.CATEGORY_PASS,
                type: Api.MULTIPASS_TYPE,
                count: this.state.passNumber == '5 Passes'? 5 : 10,
                productName: this.state.passNumber,
                budget: this.state.passNumber == '5 Passes'? this.state.price5 : this.state.price10,
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
        let multipassImage = require('../assets/images/multipass.png');
        let cartImage = require('../assets/images/cart.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>MULTI PASS</Text>

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
                    <Text style={ [Styles.redColor, style.budgetText, Styles.middleFont, Styles.textAlignLeft] }>SGD {this.state.passNumber == '5 Passes'? this.state.price5 : this.state.price10}</Text>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* Cart Item */}
                    <ScrollView style={ [style.scrollView] } >
                        <View style={style.container}>
                            {/* pass image */}
                            <Image source={multipassImage} style={style.passImage} resizeMode='contain' />

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>A 10-Multipass permits a person to purchase 10 Day passes. When a day pass is utilized, multiple entries are allowed on that day only, until the closing time. The expiry of the 10 Multi Pass entries is 12 months from date of purchase. <Text style={ [Styles.redColor, Styles.smallFont] }>${this.state.price10}</Text></Text>

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>A 5-Multipass permits a person to purchase 5 Day passes. Similar to the 10-Multipass, multiple entries are allowed during that one day, when utilized. The expiry of the 5 Multi Pass entries is 6 months from date of purchase. <Text style={ [Styles.redColor, Styles.smallFont] }>${this.state.price5}</Text></Text>

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />
                            
                            
                        </View>                        
                    </ScrollView>

                    <View style={ style.dropDownComponentContainer }>
                        <Dropdown
                            textColor = '#5EC3AE'
                            baseColor = '#5EC3AE'
                            onChangeText={this.passNumberSelected}
                            label='Select number of passes'
                            data={passesData}
                            containerStyle={style.dropdownContainer}
                            fontSize={ moderateScale(16) }
                            labelFontSize={ moderateScale(12) }
                        />
                    </View>

                    {/* space */}
                    <View style={ [Styles.superLargeSpace] } />

                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton,]}
                        activeOpacity={0.5}
                        onPress={() => this.addToCart()} >
                        ADD TO CART
                    </Button>

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

const passesData = [
    { value: '5 Passes' },
    { value: '10 Passes' },
];

MultipassPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

MultipassPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MultipassPage);