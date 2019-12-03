import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform
} from 'react-native';

import Button from 'apsl-react-native-button'

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

export default class RentalPage extends Component {
	constructor(props) {
        super(props);
    }

    goPassInOutPage() {
        this.props.navigator.push({
            screen: 'Passes.PassInOutPage'
        });
    }

    goCartPage() {
        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 2
            }
        });
    }

    goShoeRentalPage() {
        this.props.navigator.push({
            screen: 'Buy.ShoeRentalPage'
        });
    }

    goSockRentalPage() {
        this.props.navigator.push({
            screen: 'Buy.SockRentalPage'
        });
    }

    goGearRentalPage() {
        this.props.navigator.push({
            screen: 'Buy.GearRentalPage'
        });
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let cartImage = require('../assets/images/cart.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [style.title, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>GEAR</Text>

                        <TouchableOpacity key={1} onPress={() => this.goCartPage() }>
                            <Image 
                                style={style.cartImage}
                                source={cartImage} 
                            />                     
                        </TouchableOpacity>                     
                    </View>

                    {/* space */}
                    <View style={ [Styles.middleSpace] } />

                    {/* Category container */}
                    <View style={ [style.buttonContainer] } >
                        <Button
                            textStyle={ [ Styles.largeFont, Styles.lightGreenColor] }                    
                            style={[Styles.stretch, style.passInactiveButton]}
                            activeOpacity={0.5}
                            onPress={() => this.goShoeRentalPage()} >
                            SHOE RENTAL
                        </Button>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        <Button
                            textStyle={ [ Styles.largeFont, Styles.lightGreenColor] }                    
                            style={[Styles.stretch, style.passInactiveButton]}
                            activeOpacity={0.5}
                            onPress={() => this.goSockRentalPage()} >
                            SOCKS
                        </Button>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        <Button
                            textStyle={ [ Styles.largeFont, Styles.lightGreenColor] }                    
                            style={[Styles.stretch, style.passInactiveButton]}
                            activeOpacity={0.5}
                            onPress={() => this.goGearRentalPage()} >
                            CHALKBAG RENTAL
                        </Button>
                    </View>
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
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    passInactiveButton: {
        backgroundColor: '#d8d8d8',
        borderColor: '#d8d8d8',
    },
    passActiveButton: {
        backgroundColor: '#5EC3AE',
        borderColor: '#5EC3AE',
    },
    title: {
        color: '#0D4C6B',
        marginLeft: moderateScale(50)
    },
    cartImage: {
        width: moderateScale(50),
        height: moderateScale(50)
    }
})

RentalPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};