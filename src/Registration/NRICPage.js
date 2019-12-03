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
import Toast, {DURATION} from 'react-native-easy-toast'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Util from '../Helper/Util'

class NRICPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            enableNextButton: false
		};

        this.nricChanged = this.nricChanged.bind(this)
    }

    async componentDidMount() {
        nric = await Storage.getNRIC()
        this.props.actions.nricChanged( nric )

        this.setState({
            enableNextButton: nric.length > 5
        })
    }

    nricChanged(e) {
        nric = e.nativeEvent.text
        this.props.actions.nricChanged( nric )

        // check the possibility of next move.
        this.setState( {
            enableNextButton: nric.length > 5
        } )
    }

    goNextPage() {
        if (!this.state.enableNextButton) {
            return;
        }

        if ( !Util.validateAlphanumeric(this.props.nric) ) {
            this.refs.toast.show('Please enter only alphanumeric');
            return;
        }
        
        Storage.setNRIC( this.props.nric )

        this.props.navigator.push({
            screen: 'Registration.DOBPage',
        });
    }

	render() {
        const { nric } = this.props;

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
                            value={ nric }
                            maxLength={9}
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

NRICPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

NRICPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(NRICPage);