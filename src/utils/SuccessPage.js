import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    ImageBackground,
    BackHandler,
    Text,
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import SignatureCapture from 'react-native-signature-capture';
import { Navigation } from 'react-native-navigation';
import { Icon } from 'react-native-elements';

import IconBadge from 'react-native-icon-badge';

export default class SuccessPage extends Component {
	constructor(props) {
        super(props);

        this.goHomePage = this.goHomePage.bind(this)
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPress)
    }

    backPress = () => true

    goHomePage() {
        for(var i = 0; i < this.props.popNum; i++) {
            this.props.navigator.pop( {animated: false,} );
        }
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, Styles.normalPadding, style.container] } >
                    {/* success content */}
                    <View style={style.contentContainer}>
                        <Icon name="check-circle-o"
                            type="font-awesome"
                            size={moderateScale(100)}
                            color="#5EC3AE"
                            onPress={() => this.clearPhonenumber()}
                        />

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        <Text style={ [Styles.lightGrayColor, Styles.largeFont, Styles.textAlignCenter] }>SUCCESS</Text>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        <Text style={ [Styles.lightGrayColor, Styles.smallFont, Styles.textAlignCenter] }>{this.props.message}</Text>
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
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch'
    }
})

SuccessPage.navigatorStyle = {
    navBarHidden: true,
    disabledBackGesture: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};