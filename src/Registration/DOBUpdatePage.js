import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import { Icon } from 'react-native-elements'
import Button from 'apsl-react-native-button'
import DatePicker from 'react-native-datepicker'

import * as Storage from '../Helper/Storage'
import * as Util from '../Helper/Util'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import dateFormat from 'dateformat'

class DOBUpdatePage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            dob: this.props.dob,
            enableNextButton: this.props.dob.length > 0
        }

        this.dobChanged = this.dobChanged.bind(this)
    }

    dobChanged(date) {
        if (date === null || date == '') {
            return;
        }

        this.setState({
            dob: date,
            enableNextButton: date.length > 0
        })
    }

    confirmValue() {
        if (!this.state.enableNextButton) {
            return;
        }

        Storage.setDOB( dateFormat(new Date(this.state.dob), "dd mmm yyyy") )
        this.props.actions.dobChanged( dateFormat(new Date(this.state.dob), "dd mmm yyyy") )

        this.props.navigator.pop();
    }    

	render() {

		return (
            <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >
                <View style={ [style.container] } >
                    {/* space */}
                    <View style={Styles.superLargeSpace} />

                    {/* DOB */}
                    <View style={style.datePickerContainer}>
                        <DatePicker
                            date={this.state.dob}
                            mode="date"
                            placeholder="Date of Birth"
                            format="DD MMM YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            style={[style.datePicker,]}
                            customStyles={{
                                dateText: [Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont],
                                placeholderText: [Styles.middleFont],
                                dateInput: [ style.dateInput ]
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => this.dobChanged(date)}
                        />
                    </View>
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
		);
	}
}

const style = StyleSheet.create({
    datePicker: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: moderateScale(1),
        flex: 1,
        backgroundColor: 'white',
    },

    dateInput: {
        height: moderateScale(40),
        borderWidth: 0,
        borderColor: 'white',
    },

    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: moderateScale(40),
        backgroundColor: '#979797'
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

DOBUpdatePage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

DOBUpdatePage.propTypes = {
	actions: PropTypes.object.isRequired,
    dob: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
    return {
        dob: state.cima.dob,
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(DOBUpdatePage);