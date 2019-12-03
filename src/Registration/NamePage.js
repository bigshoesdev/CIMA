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
import Toast, {DURATION} from 'react-native-easy-toast'

import * as Storage from '../Helper/Storage'
import * as Util from '../Helper/Util'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class NamePage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            enableNextButton: false,
		};

        this.firstNameChanged = this.firstNameChanged.bind(this)
        this.lastNameChanged = this.lastNameChanged.bind(this)
    }

    async componentDidMount() {
        firstName = await Storage.getFirstName()
        lastName = await Storage.getLastName()

        this.props.actions.firstNameChanged( firstName )
        this.props.actions.lastNameChanged( lastName )

        this.setState({
            enableNextButton: firstName.length > 1 && lastName.length > 1
        })
    }

    goNextPage() {
        if (!this.state.enableNextButton) {
            return;
        }

        if ( !Util.validateAlphabetic(this.props.firstName) ) {
            this.refs.toast.show('First name is only acceptible alphabet')
            return
        }

        if ( !Util.validateAlphabetic(this.props.lastName) ) {
            this.refs.toast.show('Last name is only acceptible alphabet')
            return
        }

        Storage.setFirstName(this.props.firstName)
        Storage.setLastName(this.props.lastName)
        
        this.props.navigator.push({
            screen: 'Registration.NRICPage',
        });
    }

    firstNameChanged(e) {
        firstName = e.nativeEvent.text

        this.props.actions.firstNameChanged( firstName )

        // check the possibility of next move.
        this.setState( {
            enableNextButton: firstName.length > 1 && this.props.lastName.length > 1
        } )
    }

    lastNameChanged(e) {
        lastName = e.nativeEvent.text

        this.props.actions.lastNameChanged( lastName )

        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.props.firstName.length > 1 && lastName.length > 1
        } )
    }

	render() {
        const { firstName, lastName } = this.props;

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
                            value={ firstName }
                        />

                        {/* last name */}
                        <View style={Styles.middleSpace} />
                        <TextInput 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                            placeholder='Last Name'
                            onChange={this.lastNameChanged}
                            refs='lastName'
                            value={lastName}
                        />
                    </View>

                    {/* indicator */}
                    <View style={style.indicatorContainer}>
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#5EC3AE'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                    </View>

                    {/* next button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={ this.state.enableNextButton? Styles.activeButton: Styles.inactiveButton}
                        activeOpacity={this.state.enableNextButton? 0.5:1}
                        onPress={() => this.goNextPage()} >
                        NEXT
                    </Button>

                    <Toast ref="toast"/>
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

NamePage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

NamePage.propTypes = {
	actions: PropTypes.object.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps)(NamePage);