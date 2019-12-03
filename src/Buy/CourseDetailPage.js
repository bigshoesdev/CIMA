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

import Styles from '../assets/styles/styles';

export default class CourseDetailPage extends Component {
	constructor(props) {
        super(props);
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>COURSE DETAILS</Text>
                    </View>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* budget */}
                    <Text style={ [Styles.redColor, style.budgetText, Styles.middleFont, Styles.textAlignLeft] }>SGD 0.00</Text>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* Course */}
                    <ScrollView style={ [style.scrollView] } >
                        <View style={style.container}>
                            {/* pass image */}
                            <Image source={backgroundImage} style={style.courseImage} />

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>Comming soon...</Text>
                        </View>                        
                    </ScrollView>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />
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
        height: 50,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    budgetText: {
        alignSelf: 'stretch'
    },
    courseImage: {
        flex: 1,
        height: 150
    },
    dropDownContainer: {
        flex: 1,
        alignSelf: 'stretch'
    }
})

CourseDetailPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};