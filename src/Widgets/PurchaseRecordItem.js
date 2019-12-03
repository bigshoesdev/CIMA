import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import Styles from '../assets/styles/styles';

export default class PurchaseRecordItem extends Component {
	constructor(props) {
        super(props);
    }

	render() {
		return (
			<View style={ [style.container] } >
                <View style={ [Styles.smallSpace] } />

                {/* Item content */}
                <View style={style.dateItemContainer}>
                    {/* Date */}
                    <View style={style.dateContainer}>
                        {/* space */}
                        <View style={ [Styles.smallSpace] } />
                        <Text style={ [ Styles.smallFont, Styles.lightGrayColor] }>{this.props.date}</Text>
                    </View>

                    {/* Items */}
                    <View style={style.itemContainer}>
                        {this.props.items.map((item, i) => 
                            <View key={i}>
                                {/* space */}
                                <View style={ [Styles.smallSpace] } />

                                <Text key={i} style={ [ Styles.smallFont, Styles.lightGrayColor] }>                                
                                    {item}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* underline */}
                <View style={ [Styles.centerInRow, Styles.smallPaddingTop, this.props.underline? Styles.visible : Styles.hidden] } >
                    {/* space */}
                    <View style={ [Styles.smallSpace] } />
                    
                    <View style={ [ Styles.stretch, Styles.underline] }/>
                    
                    {/* space */}
                    <View style={ [Styles.smallSpace] } />
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
    dateContainer: {
        flex: 1
    },
    dateItemContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    itemContainer: {
        flex: 2,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
})

PurchaseRecordItem.propTypes = {
    date: PropTypes.string,
    items: PropTypes.array,
    underline: PropTypes.bool
}

PurchaseRecordItem.defaultProps = {
    date: 'Date',
    items: ['Item'],
    underline: false
}