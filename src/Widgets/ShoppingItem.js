import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

export default class ShoppingItem extends Component {
	constructor(props) {
        super(props);
    }

	render() {
		return (
			<View style={ [style.container, this.props.style] } >
                {/* seperator */}
                <View style={ [Styles.centerInRow, Styles.smallPaddingTop, ] } >
                    <View style={ [ Styles.stretch, style.seperator] }/>
                </View>

                {/* space */}
                <View style={ [Styles.smallSpace] } />

                {/* Item content */}
                <View style={style.itemContainer}>
                    {/* Product name and budget */}
                    <View style={style.productNameContainer}>
                        <Text style={ [ Styles.middleFont, Styles.darkGreenColor, Styles.stretch3X, Styles.textAlignLeft] }>{this.props.productName} {this.props.quantity > 1? '(':''}{this.props.quantity > 1? this.props.quantity:''}{this.props.quantity > 1? ')':''}</Text>
                        <Text style={ [ Styles.middleFont, Styles.redColor, Styles.stretch2X, Styles.textAlignRight] }>{this.props.billUnit} - {this.props.budget}</Text>
                    </View>

                    {/* Product info */}
                    <Text style={ [ Styles.smallFont, Styles.darkGreenColor, Styles.stretch3X, Styles.textAlignRight] }>{this.props.infoKey != '' && this.props.infoValue != ''? '(':''}{this.props.infoKey}{this.props.infoKey != ''? ': ' : ''}{this.props.infoValue}{this.props.infoKey != '' && this.props.infoValue != ''? ')':''}</Text>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* Delete */}
                    <TouchableOpacity style={{flex: 1}} key={1} onPress={() => this.props.delete( this.props.category,this.props.index ) }>
                        <Text style={ [Styles.redColor, Styles.smallFont, Styles.stretch, Styles.textAlignRight] }>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        paddingLeft: moderateScale(10),
        paddingRight: moderateScale(10)
    },
    productNameContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    dateItemContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    seperator: {
        borderBottomWidth: 1,
        borderBottomColor: '#5EC3AE'
    },    
})

ShoppingItem.propTypes = {
    category: PropTypes.string,
    index: PropTypes.number,
    productName: PropTypes.string,
    budget: PropTypes.number,
    billUnit: PropTypes.string,
    infoKey: PropTypes.string,
    infoValue: PropTypes.string,
    quantity: PropTypes.number,
    style: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
        PropTypes.object,
    ])
}

ShoppingItem.defaultProps = {
    category: '',
    index: 0,
    productName: '',
    budget: 0,
    billUnit: 'SGD',
    infoKey: '',
    infoValue: '',
    quantity: 0,
    style: undefined
}