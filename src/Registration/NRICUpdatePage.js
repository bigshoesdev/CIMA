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

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import { Icon } from 'react-native-elements'
import Button from 'apsl-react-native-button'
import * as Storage from '../Helper/Storage'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Util from '../Helper/Util'

class NRICUpdatePage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            nric: this.props.nric,
            enableNextButton: this.props.nric.length > 5
		};

        this.nricChanged = this.nricChanged.bind(this)
    }

    nricChanged(e) {
        this.setState( {
            nric: e.nativeEvent.text,
            enableNextButton: e.nativeEvent.text.length > 5
        } )
    }

    confirmValue() {
        if (!this.state.enableNextButton) {
            return;
        }

        if ( !Util.validateAlphanumeric( this.state.nric ) ) {
            this.refs.toast.show('Please enter only alphanumeric');
            return;
        }

        this.props.actions.nricChanged( this.state.nric )
        Storage.setNRIC( this.state.nric )

        this.props.navigator.pop();
    }

	render() {

		return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >
                    <View style={ [ style.container] } >
                        {/* space */}
                        <View style={Styles.superLargeSpace} />

                        {/* NRIC */}
                        <TextInput 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                            placeholder='NRIC or Passport Number'
                            onChange={this.nricChanged}
                            value={ this.state.nric }
                            maxLength={9}
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
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
})

NRICUpdatePage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

NRICUpdatePage.propTypes = {
	actions: PropTypes.object.isRequired,
    nric: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
    return {
        nric: state.cima.nric,
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(NRICUpdatePage);