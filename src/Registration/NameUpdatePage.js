import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import { Icon } from 'react-native-elements'
import Button from 'apsl-react-native-button'
import * as Storage from '../Helper/Storage'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class NameUpdatePage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            enableNextButton: this.props.firstName.length > 0 && this.props.lastName.length > 0,
            firstName: this.props.firstName,
            lastName: this.props.lastName
		};

        this.firstNameChanged = this.firstNameChanged.bind(this)
        this.lastNameChanged = this.lastNameChanged.bind(this)
    }

    confirmValue() {
        if (!this.state.enableNextButton) {
            return;
        }

        Storage.setFirstName(this.state.firstName)
        Storage.setLastName(this.state.lastName)

        this.props.actions.firstNameChanged( this.state.firstName )
        this.props.actions.lastNameChanged( this.state.lastName )
        
        this.props.navigator.pop();
    }

    firstNameChanged(e) {
        this.setState( {
            firstName: e.nativeEvent.text,
            enableNextButton: e.nativeEvent.text.length > 0 && this.state.lastName.length > 0
        } )
    }

    lastNameChanged(e) {
        this.setState( {
            lastName: e.nativeEvent.text,
            enableNextButton: this.state.firstName.length > 0 && e.nativeEvent.text.length > 0
        } )
    }

	render() {

		return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >
                    <View style={ [ style.container] } >
                        {/* space */}
                        <View style={Styles.superLargeSpace} />

                        {/* First name */}
                        <TextInput 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                            placeholder='First Name' 
                            onChange={this.firstNameChanged}
                            ref='firstName'
                            value={ this.state.firstName }
                        />

                        {/* last name */}
                        <View style={Styles.middleSpace} />
                        <TextInput 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                            placeholder='Last Name'
                            onChange={this.lastNameChanged}
                            refs='lastName'
                            value={this.state.lastName}
                        />
                    </View>

                    {/* next button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={ this.state.enableNextButton? Styles.activeButton: Styles.inactiveButton}
                        activeOpacity={this.state.enableNextButton? 0.5:1}
                        onPress={() => this.confirmValue()} >
                        CONFIRM
                    </Button>
                </View>
            </TouchableWithoutFeedback>
		);
	}
}

const style = StyleSheet.create({
    codeInput: {
        height: moderateScale(40),
        alignSelf: 'stretch'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

NameUpdatePage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

NameUpdatePage.propTypes = {
	actions: PropTypes.object.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
    return {
        firstName: state.cima.firstName,
        lastName: state.cima.lastName,
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(NameUpdatePage);