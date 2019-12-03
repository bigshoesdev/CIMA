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

export default class PaymentSuccessPage extends Component {
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
        let checkImage = require('../assets/images/check-circle-green.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, Styles.normalPadding, style.container] } >
                    {/* success content */}
                    <View style={style.container}>
                        <View style={style.outsideContentContainer}>
                            <View style={style.contentContainer}>
                                {/* space */}
                                <View style={ [Styles.normalSpace, this.props.items.length < 1 ? Styles.visible : Styles.hidden] } />

                                <Text 
                                    style={ [Styles.lightGreenColor, Styles.largeFont, Styles.textAlignCenter, style.extend, Styles.middleFont] }
                                    numberOfLines={1}
                                >PAYMENT SUCCESSFUL!</Text>
                                
                                {/* space */}
                                <View style={ [Styles.smallSpace] } />

                                <Text style={ [Styles.redColor, Styles.middleFont, Styles.textAlignLeft, style.extend, this.props.items.length < 1 ? Styles.hidden : Styles.visible] }>Please approach the counter staff with this screen to collect your gear:</Text>

                                {/* space */}
                                <View style={ [Styles.smallSpace] } />

                                {this.props.items.map((item, i) => 
                                    <Text key={i} style={ [Styles.redColor, Styles.smallFont, Styles.textAlignLeft, style.extend] }>- {item.quantity} x {item.product}</Text>
                                )}                                
                            </View>

                            <View style={[style.iconBadge]}>
                                <Image source={ checkImage } style={style.checkImage} />
                            </View>
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
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    outsideContentContainer: {
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        marginLeft: moderateScale(10),
        marginRight: moderateScale(10),
        minWidth: moderateScale(300)
    },
    contentContainer: {
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: '#d8d8d8',
        margin: moderateScale(15),
        borderRadius: moderateScale(5),
        padding: moderateScale(20)
    },
    extend: {
        alignSelf: 'stretch'
    },
    iconBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        minWidth: moderateScale(30),
        height: moderateScale(30),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    checkImage: {
        height: moderateScale(30),
        width: moderateScale(30)
    }
})

PaymentSuccessPage.navigatorStyle = {
    navBarHidden: true,
    disabledBackGesture: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};