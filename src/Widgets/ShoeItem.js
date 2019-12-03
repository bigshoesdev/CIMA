import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import Styles from '../assets/styles/styles';
import { Icon } from 'react-native-elements';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

export default class ShoeItem extends Component {
	constructor(props) {
        super(props);
    }

	render() {
		return (
			<View style={ [style.container] } >
                {/* space */}
                <View style={ [Styles.smallSpace] } />

                {/* row */}
                <View style={Styles.centerInRow}>
                    <Text style={ [Styles.lightGreenColor, Styles.smallFont, Styles.stretch3X, Styles.textAlignLeft] }>Size {this.props.size}</Text>
                    <Text style={ [Styles.lightGreenColor, Styles.smallFont, Styles.stretch2X, Styles.textAlignCenter] }>{this.props.quantity}</Text>
                    <View style={ [Styles.stretch, ] }>
                        <Icon name="circle-with-cross"
                            type="entypo"
                            size={moderateScale(15)}
                            color="red"
                            onPress={() => this.props.removeItem(this.props.index)}
                        />
                    </View>
                </View>
            </View>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

ShoeItem.propTypes = {
    size: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    removeItem: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
}
ShoeItem.defaultProps = {
    size: '',
    quantity: 0,
    removeItem: null,
    index: -1
}