import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
	View
} from 'react-native';

import { Icon } from 'react-native-elements'
import Button from 'apsl-react-native-button'

import Styles from '../assets/styles/styles'

// swiper
import Swiper from 'react-native-swiper'

// individual pages
import VerificationPage from './VerificationPage'
import NamePage from './NamePage'
import NRICPage from './NRICPage'
import DOBPage from './DOBPage'
import EmergencyContactPage from './EmergencyContactPage'
import GuardianContactPage from './GuardianContactPage'
import SelfiePage from './SelfiePage'

// configuration
import * as Configuration from '../constants/api';

export default class OnboardingContainer extends Component {
	constructor(props) {
        super(props);
        
        this.indexChanged = this.indexChanged.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.doContinue = this.doContinue.bind(this)

        this.state = {
            activeIndex: 0,
            isOnPressing: false,
        }

        this.onboardingPages = [
            <VerificationPage />,
            <NamePage />,
            <NRICPage />,
            <DOBPage />,
            <EmergencyContactPage />,
            <SelfiePage />,
        ];
    }

    addPage() {
        if(this.state.activeIndex+1 > Configuration.SelfiePage) {
            return false
        }
        var newPages = this.state.availablePages.concat([this.onboardingPages[this.state.activeIndex+1]]); 
        this.setState({
            availablePages: newPages,
            activeIndex: this.state.activeIndex+1
        });

        return true
    }

    removePage() {

    }

    indexChanged(index) {
        if ( Configuration.VerificationPage <= index || index <= Configuration.SelfiePage ) {
            this.setState({
                activeIndex: index
            })
        } else {
            this.setState({
                activeIndex: Configuration.VerificationPage
            })
        }       
    }

    nextPage() {
        if ( !this.addPage() ) {
            return;
        }
        this.refs.swiper.scrollBy(1);
    }

    doContinue() {
        this.props.navigator.push({
            screen: 'Registration.SummaryPage'
        });
    }

	render() {
        var onPressProps;
        if (this.state.isOnPressing) {
            onPressProps = style.buttonStylePressing
        } else {
            onPressProps = style.buttonStyle
        }

		return (
			<View style={ [ Styles.centerContainer, Styles.hideLogoByBackground] } >
                {/* page view */}
                <Swiper style={style.wrapper} ref='swiper' scrollEnabled={true} showsHorizontalScrollIndicator={false} showsPagination={false} loop={false} onIndexChanged={ (index) => this.indexChanged(index) } >
                    {this.onboardingPages.map((page, i) => 
                        <View key={i} style={Styles.stretch}>
                            {page}
                        </View>
                    )}
                </Swiper>

                {/* indicator */}
                <View style={style.indicatorContainer}>
                    <Icon name="dot-single"
                        type="entypo"
                        size={50}
                        color={ this.state.activeIndex == 0 ? '#5EC3AE' : '#d8d8d8' }
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={50}
                        color={ this.state.activeIndex == 1 ? '#5EC3AE' : '#d8d8d8' }
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={50}
                        color={ this.state.activeIndex == 2 ? '#5EC3AE' : '#d8d8d8' }
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={50}
                        color={ this.state.activeIndex == 3 ? '#5EC3AE' : '#d8d8d8' }
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={50}
                        color={ this.state.activeIndex == 4 ? '#5EC3AE' : '#d8d8d8' }
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={50}
                        color={ this.state.activeIndex == 5 ? '#5EC3AE' : '#d8d8d8' }
                    />
                </View>

                {/* next button */}
                <Button
                    textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                    style={[Styles.activeButton, Styles.normalMargin,]}
                    onPress={() => this.doContinue()} >
                    NEXT
                </Button>
                
            </View>
		);
	}
}

const style = StyleSheet.create({
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    prevNextButton: {
        fontSize: 100,
        color: '#5EC3AE',
        fontFamily: 'Arial'
    },
})

OnboardingContainer.navigatorStyle = {
    navBarHidden: true
};