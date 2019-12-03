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
import * as Api from '../constants/api'
import * as Util from '../Helper/Util'

import * as CIMAService from '../Helper/CIMAService'

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import firebase from 'react-native-firebase';

class GearRentalPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            price: 0
        }

        this.quantitySelected = this.quantitySelected.bind(this)
        this.goCartPage = this.goCartPage.bind(this)
        this.addToCart = this.addToCart.bind(this)
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.userToken = await Storage.getToken()

        var item = JSON.parse(await Storage.getGearCart())
        this.props.actions.gearCartChanged( item )

        this.passCart = JSON.parse(await Storage.getPassCart())

        var param = {
            user_id: this.userId,
            user_token: this.userToken,
            type: Api.CHALKBAG_TYPE
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
        if ( this.props.gearCart != null ) {
            Storage.setGearCart( JSON.stringify(this.props.gearCart) )
        }

        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

    quantitySelected( number ) {
        var item = {
            category: Configuration.CATEGORY_GEAR,
            type: Api.CHALKBAG_TYPE,
            productName: 'Gear Rental',
            budget: this.state.price * parseInt( number ),
            billUnit: 'SGD',
            infoKey: 'Size',
            infoValue: 'FREE',
            quantity: parseInt( number )
        }

        this.props.actions.gearCartChanged( item )
    }

    addToCart() {
        if ( this.props.gearCart.quantity < 1 ) {
            this.refs.toast.show('Please choose quantity.')
            return    
        }

        if ( Util.getIndex( Api.SEASONPASS_TYPE, this.passCart, 'type' ) > -1 ) {
            this.refs.toast.show('It cannot be purchased together with season pass')
            return
        }

        Storage.setGearCart( JSON.stringify(this.props.gearCart) )

        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 3
            }
        });
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let chalkbagImage = require('../assets/images/chalkbag.png');
        let cartImage = require('../assets/images/cart.png');

        const { 
            gearCart
        } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>CHALKBAG RENTAL</Text>

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
                    <Text style={ [Styles.redColor, style.budgetText, Styles.middleFont, Styles.textAlignLeft] }>{this.state.price == 0? 'FREE':'SGD $' + this.state.price}</Text>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* Gear */}
                    <ScrollView style={ [style.scrollView] } >
                        <View style={style.container}>
                            {/* pass image */}
                            <Image source={chalkbagImage} style={style.gearImage} resizeMode='contain' />

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>Chalk is a desiccant agent, which helps a lot in climbing, by keeping the palms and fingers relatively dry. While chalk is not available for free, we provide free use of chalkbags for you to use. Top it up with the right amount of your favorite chalk to avoid spillage, and reduce waste.</Text>

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>If you are unsure of what chalk to use, do check out our premium range of chalk from Tokyo Powder Industries. <Text style={ [Styles.redColor, Styles.smallFont] }>{ this.state.price == 0? 'FREE':'$' + this.state.price }</Text></Text>

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />
                            
                        </View>                        
                    </ScrollView>

                    <View style={ style.dropDownComponentContainer }>
                        <Dropdown
                            textColor = '#5EC3AE'
                            baseColor = '#5EC3AE'
                            onChangeText={this.quantitySelected}
                            label='Quantity'
                            data={quantityData}
                            value={gearCart.quantity < 1 ? '':gearCart.quantity.toString()}
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
    budgetText: {
        alignSelf: 'stretch'
    },
    gearImage: {
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

const quantityData = [
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
    { value: '5' },
];

GearRentalPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

GearRentalPage.propTypes = {
    actions: PropTypes.object.isRequired,
	gearCart: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        gearCart: state.cima.gearCart
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(GearRentalPage);