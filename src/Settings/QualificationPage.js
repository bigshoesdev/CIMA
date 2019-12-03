import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Checkbox from 'react-native-custom-checkbox';
import Button from 'apsl-react-native-button'
import Toast, {DURATION} from 'react-native-easy-toast'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

class QualificationPage extends Component {
	constructor(props) {
        super(props);

        this.hasValue = this.hasValue.bind(this)
        this.hasOther = this.hasOther.bind(this)
        this.getOtherValue = this.getOtherValue.bind(this)
        this.otherChanged = this.otherChanged.bind(this)    

        this.state = {
            otherValue: this.getOtherValue(),
            level1Checked: this.hasValue( "NSCS Level 1" ),
            level2Checked: this.hasValue( "NSCS Level 2" ),
            level3Checked: this.hasValue( 'NSCS Level 3' ),
            belayChecked: this.hasValue( "ABD Belay Tag" ),
            leadChecked: this.hasValue( "ABD Lead Tag" ),
            otherChecked: this.hasOther(),
            naChecked: this.hasValue( 'N.A.' )
        }
    }

    otherChanged(e) {
        this.setState({
            otherValue: e.nativeEvent.text
        })
    }

    saveQualification() {
        var updatedQualification = []
        if (this.state.level1Checked) {
            updatedQualification.push('NSCS Level 1')
        }

        if (this.state.level2Checked) {
            updatedQualification.push('NSCS Level 2')
        }

        if (this.state.level3Checked) {
            updatedQualification.push('NSCS Level 3')
        }

        if (this.state.belayChecked) {
            updatedQualification.push('ABD Belay Tag')
        }

        if (this.state.leadChecked) {
            updatedQualification.push('ABD Lead Tag')
        }

        if (this.state.otherChecked) {
            if (this.state.otherValue === '') {
                this.refs.toast.show('Other is empty');
                return
            }

            updatedQualification.push(this.state.otherValue)
        }

        if (this.state.naChecked) {
            updatedQualification.push('N.A.')
        }

        this.props.actions.qualificationChanged( updatedQualification )

        this.props.navigator.pop({});
    }

    hasValue( value ) {
        var index = this.props.qualification.indexOf(value)
        return index > -1
    }

    hasOther() {
        let defaultQualificationArray = [
            'NSCS Level 1',
            'NSCS Level 2',
            'NSCS Level 3',
            'ABD Belay Tag',
            'ABD Lead Tag',
            'N.A.',
        ]

        var other = this.props.qualification.filter( (item) => defaultQualificationArray.indexOf(item) < 0 )

        return other.length > 0
    }

    getOtherValue() {
        let defaultQualificationArray = [
            'NSCS Level 1',
            'NSCS Level 2',
            'NSCS Level 3',
            'ABD Belay Tag',
            'ABD Lead Tag',
            'N.A.',
        ]

        var other = this.props.qualification.filter( (item) => defaultQualificationArray.indexOf(item) < 0 )

        return other.length > 0 ? other[0] : ''
    }

	render() {

		return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={ [Styles.normalMargin, style.container, Styles.hideLogoByBackground] } >
                    <View style={ [Styles.smallMargin, style.contentContainer,] }>
                        <Text style={ [Styles.largeFont, Styles.darkGrayColor] } >Please check all that applies</Text>

                        {/* NSCS Level 1 */}
                        <View style={ [style.checkboxContainer, Styles.normalPaddingTop] }>
                            <View>
                                <Checkbox
                                    checked={this.state.level1Checked}
                                    onChange={(name, checked) => this.setState({ level1Checked: checked })}
                                    style={{backgroundColor: 'white', color:'#696969', borderWidth: 1}}
                                    size={moderateScale(25)}
                                    ref='level1'
                                />
                            </View>
                            <View>
                                <Text style={ [Styles.stretch, style.paddingLeft, Styles.lightGrayColor, Styles.largeFont] }>NSCS Level 1</Text>
                            </View>                    
                        </View>

                        {/* NSCS Level 2 */}
                        <View style={ [style.checkboxContainer, Styles.normalPaddingTop] }>
                            <View>
                                <Checkbox
                                    checked={this.state.level2Checked}
                                    onChange={(name, checked) => this.setState({ level2Checked: checked })}
                                    style={{backgroundColor: 'white', color:'#696969', borderWidth: 1}}
                                    size={moderateScale(25)}
                                    ref='level2'
                                />
                            </View>
                            <View>
                                <Text style={ [Styles.stretch, style.paddingLeft, Styles.lightGrayColor, Styles.largeFont] }>NSCS Level 2</Text>
                            </View>                    
                        </View>

                        {/* NSCS Level 3 */}
                        <View style={ [style.checkboxContainer, Styles.normalPaddingTop] }>
                            <View>
                                <Checkbox
                                    checked={this.state.level3Checked}
                                    onChange={(name, checked) => this.setState({ level3Checked: checked })}
                                    style={{backgroundColor: 'white', color:'#696969', borderWidth: 1}}
                                    size={moderateScale(25)}
                                    ref='level3'
                                />
                            </View>
                            <View>
                                <Text style={ [Styles.stretch, style.paddingLeft, Styles.lightGrayColor, Styles.largeFont] }>NSCS Level 3</Text>
                            </View>                    
                        </View>

                        {/* ABD Belay Tag */}
                        <View style={ [style.checkboxContainer, Styles.normalPaddingTop] }>
                            <View>
                                <Checkbox
                                    checked={this.state.belayChecked}
                                    onChange={(name, checked) => this.setState({ belayChecked: checked })}
                                    style={{backgroundColor: 'white', color:'#696969', borderWidth: 1}}
                                    size={moderateScale(25)}
                                    ref='belay'
                                />
                            </View>
                            <View>
                                <Text style={ [Styles.stretch, style.paddingLeft, Styles.lightGrayColor, Styles.largeFont] }>ABD Belay Tag</Text>
                            </View>                    
                        </View>

                        {/* ABD Lead Tag */}
                        <View style={ [style.checkboxContainer, Styles.normalPaddingTop] }>
                            <View>
                                <Checkbox
                                    checked={this.state.leadChecked}
                                    onChange={(name, checked) => this.setState({ leadChecked: checked })}
                                    style={{backgroundColor: 'white', color:'#696969', borderWidth: 1}}
                                    size={moderateScale(25)}
                                    ref='lead'
                                />
                            </View>
                            <View>
                                <Text style={ [Styles.stretch, style.paddingLeft, Styles.lightGrayColor, Styles.largeFont] }>ABD Lead Tag</Text>
                            </View>                    
                        </View>

                        {/* Others: */}
                        <View style={ [style.checkboxContainer, Styles.normalPaddingTop] }>
                            <View>
                                <Checkbox
                                    checked={this.state.otherChecked}
                                    onChange={(name, checked) => this.setState({ otherChecked: checked })}
                                    style={{backgroundColor: 'white', color:'#696969', borderWidth: 1}}
                                    size={moderateScale(25)}
                                    ref='other'
                                />
                            </View>
                            <View style={Styles.centerInColumn}>
                                <Text style={ [ style.paddingLeft, Styles.lightGrayColor, Styles.largeFont,] }>Others:</Text>                           
                            </View>
                            <View style={ [Styles.stretch, Styles.underline, style.qualificationInputContainer] }>
                                <TextInput 
                                    style={ [Styles.stretch, style.qualificationInput, Styles.lightGrayColor, Styles.middleFont] } 
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    value={this.state.otherValue}
                                    onChange={this.otherChanged}
                                />
                            </View>
                        </View>

                        {/* N.A. */}
                        <View style={ [style.checkboxContainer, Styles.normalPaddingTop] }>
                            <View>
                                <Checkbox
                                    checked={this.state.naChecked}
                                    onChange={(name, checked) => this.setState({ naChecked: checked })}
                                    style={{backgroundColor: 'white', color:'#696969', borderWidth: 1}}
                                    size={moderateScale(25)}
                                    ref='na'
                                />
                            </View>
                            <View>
                                <Text style={ [Styles.stretch, style.paddingLeft, Styles.lightGrayColor, Styles.largeFont] }>N.A.</Text>
                            </View>                    
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />
                    </View>

                    {/* Confirm button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton]}
                        activeOpacity={0.5}
                        onPress={() => this.saveQualification()} >
                        SAVE
                    </Button>

                    <Toast ref="toast"/>
                </View>
            </TouchableWithoutFeedback>
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
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch'
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    qualificationInput: {
        height: moderateScale(40),
    },
    qualificationInputContainer: {
        marginLeft: moderateScale(20),
        height: moderateScale(40),
    },
    paddingLeft: {
        paddingLeft: moderateScale(10),
    }
})

QualificationPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

QualificationPage.propTypes = {
	actions: PropTypes.object.isRequired,
    
    // qualification
    qualification: PropTypes.array,
};

function mapStateToProps(state, ownProps) {
    return {
        // qualification
        qualification: state.cima.qualification
    };
}

function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(QualificationPage);