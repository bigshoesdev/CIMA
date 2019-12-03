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
import CourseItem from '../Widgets/CourseItem'
import { Dropdown } from 'react-native-material-dropdown'

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

export default class CourseAndWorkshopPage extends Component {
	constructor(props) {
        super(props);

        this.courseClicked = this.courseClicked.bind(this)
    }

    goCartPage() {
        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 2
            }
        });
    }

    courseSelected( course ) {
        console.log( course );
    }

    startTimeSelected( startTime ) {
        console.log( startTime )
    }

    courseClicked = () => {
        this.props.navigator.push({
            screen: 'Buy.CourseDetailPage'
        });
    }

    addToCart() {
        this.props.navigator.push({
            screen: 'Buy.CartPage',
            passProps: {
                popNum: 2
            }
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
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter, Styles.smallMargin] }>COURSES & WORKSHOPS</Text>

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
                    <Text style={ [Styles.redColor, style.budgetText, Styles.middleFont, Styles.textAlignLeft] }>SGD 0.00</Text>

                    <View style={ style.dropDownComponentContainer }>
                        <Dropdown
                            textColor = '#5EC3AE'
                            baseColor = '#5EC3AE'
                            onChangeText={this.passNumberSelected}
                            label='Select courses/workshops'
                            data={courseArray}
                            containerStyle={style.dropdownContainer}
                            fontSize={ moderateScale(16) }
                            labelFontSize={ moderateScale(12) }
                        />
                    </View>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    <View style={ style.dropDownComponentContainer }>
                        <Dropdown
                            textColor = '#5EC3AE'
                            baseColor = '#5EC3AE'
                            onChangeText={this.passNumberSelected}
                            label='Select start day & time'
                            data={dateArray}
                            containerStyle={style.dropdownContainer}
                            fontSize={ moderateScale(16) }
                            labelFontSize={ moderateScale(12) }
                        />
                    </View>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* Course & Workshop */}
                    <ScrollView style={ [style.scrollView] } >
                        <CourseItem 
                            courseImage={backgroundImage}
                            onTapping={this.courseClicked}
                            message='Comming soon...'
                        />

                        <CourseItem 
                            courseImage={backgroundImage}
                            onTapping={this.courseClicked}
                            message='Comming soon...'
                        />
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
    cartImage: {
        width: moderateScale(50),
        height: moderateScale(50)
    },
    dropDownComponentContainer: {
        alignSelf: 'stretch'
    },
    dropdownContainer: {
        height: moderateScale(50),
    }
})

const courseArray = [
    { value: 'Top 5 meters' },
    { value: 'Top 10 meters' },
    { value: 'Top 100 meters' },
];

const dateArray = [
    { value: '1 hour' },
    { value: '2 hour' },
    { value: '3 hour' },
];

CourseAndWorkshopPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};