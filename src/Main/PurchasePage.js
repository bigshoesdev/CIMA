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

import { Icon } from 'react-native-elements'
import Button from 'apsl-react-native-button'

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

export default class PurchasePage extends Component {
	constructor(props) {
        super(props);
    }

    goPassesPage() {
        this.props.navigator.push({
            screen: 'Buy.PassesPage'
        });
    }

    goRentalPage() {
        this.props.navigator.push({
            screen: 'Buy.RentalPage'
        });
    }

    goCartPage() {
        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 1
            }
        });
    }

    goCourseAndWorkshopPage() {
        this.props.navigator.push({
            screen: 'Buy.CourseAndWorkshopPage'
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
                        <Text style={ [style.title, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>BUY</Text>
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
                    <View style={ [style.categoryContainer] } >
                        {/* Passes & Gear */}
                        <View style={[style.buttonContainer, ]}>
                            {/* Passes */}
                            <View style={ [style.container] }>
                                <Button
                                    textStyle={ [ Styles.largeFont, Styles.lightGreenColor, Styles.verySmallPadding] }                    
                                    style={[Styles.stretch, style.passInactiveButton]}
                                    activeOpacity={0.5}
                                    onPress={() => this.goPassesPage()} >
                                    PASSES
                                </Button>
                            </View>
                            
                            {/* space */}
                            <View style={ [Styles.normalSpace] } />

                            {/* Gear */}
                            <View style={style.container}>
                                <Button
                                    textStyle={ [Styles.largeFont, Styles.lightGreenColor, Styles.verySmallPadding] }                    
                                    style={[Styles.stretch, style.passInactiveButton]}
                                    activeOpacity={0.5}
                                    onPress={() => this.goRentalPage()} >
                                    GEAR
                                </Button>
                            </View>
                        </View>

                        {/* space */}
                        <View style={ [Styles.smallSpace] } />

                        {/* Course & WorkShop  */}
                        <View style={[style.buttonContainer, ]}>
                            {/* Course & WorkShop */}
                            <View style={ [style.container] }>
                                <Button
                                    textStyle={ [ Styles.largeFont, Styles.lightGreenColor, Styles.verySmallPadding] }                    
                                    style={[Styles.stretch, style.passInactiveButton]}
                                    activeOpacity={0.5}
                                    onPress={() => this.goCourseAndWorkshopPage()} >
                                    COURSE/WORKSHOP
                                </Button>
                            </View>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />

                            {/* empty */}
                            <View style={[Styles.stretch, style.container ]}>
                                
                            </View>                        
                        </View>
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
    categoryContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: moderateScale(100)
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

PurchasePage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};