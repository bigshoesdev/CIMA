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

class DOBPage extends Component {
	constructor(props) {
        super(props);

        this.dobChanged = this.dobChanged.bind(this)
    }

    async componentDidMount() {
        this.props.actions.dobChanged( await Storage.getDOB() )
    }

    dobChanged(date) {
        if (date === null || date == '') {
            return;
        }

        this.props.actions.dobChanged( dateFormat(new Date(date), "dd mmm yyyy") )
    }

    goNextPage() {
        if (this.props.dob.length < 1) {
            return;
        }

        Storage.setDOB( dateFormat(new Date(this.props.dob), "dd mmm yyyy") )

        if ( Util.isLessThan18( this.props.dob ) ) {
            this.props.navigator.push({
                screen: 'Registration.GuardianContactPage',
            });
        } else {
            this.props.navigator.push({
                screen: 'Registration.EmergencyContactPage',
            });
        }
    }    

	render() {
        const { dob } = this.props;

		return (
            <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >
                <View style={ [style.container] } >
                    {/* space */}
                    <View style={Styles.superLargeSpace} />

                    {/* DOB */}
                    <View style={style.datePickerContainer}>
                        <DatePicker
                            date={dob}
                            mode="date"
                            placeholder="Date of Birth"
                            format="DD MMM YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            style={[style.datePicker,]}
                            customStyles={{
                                dateText: [Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont, style.dateText],
                                placeholderText: [Styles.middleFont],
                                dateInput: [ style.dateInput ]
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => this.dobChanged(date)}
                        />
                    </View>
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
                </View>

                {/* next button */}
                <Button
                    textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                    style={ dob.length > 0? Styles.activeButton: Styles.inactiveButton}
                    activeOpacity={dob.length > 0? 0.5:1}
                    onPress={() => this.goNextPage()} >
                    NEXT
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

    dateText: {
        alignSelf: 'stretch'
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

DOBPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

DOBPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(DOBPage);