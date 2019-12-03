import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    ScrollView
} from 'react-native';

import Styles from '../assets/styles/styles';

import UsageRecordItem from '../Widgets/UsageRecordItem'

export default class UsageTabView extends Component {
	constructor(props) {
        super(props);
    }

	render() {
        // let usages = [
        //     {
        //         date: '25 Dec 2017',
        //         time: ['1108h (IN)', '1323h (OUT)', '1517h (IN)', '1943h (OUT)',],
        //         passType: ['SEASON', 'SEASON', 'SEASON', 'SEASON',],
        //     },
        //     {
        //         date: '28 Dec 2017',
        //         time: ['1108h (IN)', '1943h (OUT)'],
        //         passType: ['PROMO', 'PROMO']
        //     },
        // ]

		return (
            <View style={ [style.container] } >
                <View style={ [Styles.normalMargin, style.container] } >
                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* usage record items */}
                    <ScrollView style={style.scrollView}>
                        {/* space */}
                        <View style={ [Styles.smallSpace] } />
                        <UsageRecordItem />

                        {this.props.usageItems.map((usage, i) => 
                            <View key={i}>
                                {/* space */}
                                <View style={ [Styles.smallSpace] } />
                                <UsageRecordItem
                                    date={ usage.date }
                                    times={ usage.time }
                                    passType={ usage.passType }
                                    underline={ this.props.usageItems.length > i+1? true: false }
                                />
                            </View>
                        )}
                        
                    </ScrollView>
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
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: 'white'
    },
    scrollView: {
        alignSelf: 'stretch'
    }
})

UsageTabView.propTypes = {
    usageItems: PropTypes.array
}