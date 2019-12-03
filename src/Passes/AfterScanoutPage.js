import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    Text,
    BackHandler,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'

export default class AfterScanoutPage extends Component {
	constructor(props) {
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPress)
    }

    backPress = () => true

    goHomePage = () => {
        for(var i = 0; i < this.props.popNum; i++) {
            this.props.navigator.pop( {animated: false,} );
        }
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, Styles.normalPadding, style.container] } >
                    {/* content */}
                    <View style={style.contentContainer}>
                        <View >
                            <Text style={ [Styles.lightGrayColor, Styles.largeFont, Styles.textAlignCenter] }>Thanks for climbing at Boulder World. We hope you have a great time!</Text>
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        <View >
                            <Text style={ [Styles.lightGreenColor, Styles.largeFont, Styles.textAlignCenter] }>CYA AGAIN SOON!</Text>
                        </View>
                    </View>

                    {/* home button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton,]}
                        activeOpacity={0.5}
                        onPress={() => this.goHomePage()} >
                        HOME
                    </Button>
                </View>
            </ImageBackground>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
})

AfterScanoutPage.navigatorStyle = {
    navBarHidden: true,
    disabledBackGesture: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};