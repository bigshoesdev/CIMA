import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import Styles from '../assets/styles/styles';

export default class UsageRecordItem extends Component {
	constructor(props) {
        super(props);
    }

	render() {
		return (
			<View style={ [style.container] } >
                {/* Item content */}
                <View style={style.dateItemContainer}>
                    {/* Date */}
                    <View style={Styles.stretch}>
                        {/* space */}
                        <View style={ [Styles.smallSpace] } />
                        <Text style={ [ Styles.smallFont, Styles.lightGrayColor] }>{ this.props.date }</Text>
                    </View>

                    {/* Time */}
                    <View style={style.itemContainer}>
                        {this.props.times.map((time, i) => 
                            <View key={i}>
                                {/* space */}
                                <View style={ [Styles.smallSpace] } />

                                <Text key={i} style={ [ Styles.smallFont, Styles.lightGrayColor] }>
                                    {time}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Pass Type */}
                    <View style={style.itemContainer}>
                        {this.props.passType.map((pass, i) => 
                            <View key={i}>
                                {/* space */}
                                <View style={ [Styles.smallSpace] } />

                                <Text key={i} style={ [ Styles.smallFont, Styles.lightGrayColor] }>
                                    {pass}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* underline */}
                <View style={ [Styles.centerInRow, Styles.smallPaddingTop, this.props.underline? style.visible : style.hidden] } >
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
    dateItemContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    visible: {
        display: 'flex'
    },
    hidden: {
        display: 'none'
    },
})

UsageRecordItem.propTypes = {
    date: PropTypes.string,
    times: PropTypes.array,
    passType: PropTypes.array,
    underline: PropTypes.bool
}
UsageRecordItem.defaultProps = {
    date: 'Date',
    times: ['Time'],
    passType: ['Pass Type'],
    underline: false
}