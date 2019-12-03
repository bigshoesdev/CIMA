import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    ScrollView
} from 'react-native';

import Styles from '../assets/styles/styles';

import PurchaseRecordItem from '../Widgets/PurchaseRecordItem'

export default class PurchaseTabView extends Component {
	constructor(props) {
        super(props);
    }

	render() {
		return (
            <View style={ [style.container] } >
                <View style={ [Styles.normalMargin, style.container] } >
                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* purchase record items */}
                    <ScrollView style={style.scrollView}>
                        <PurchaseRecordItem />

                        {
                            this.props.purchaseItems.map((item, i) => 
                                <PurchaseRecordItem
                                    key={i}
                                    date={item.date}
                                    items={ item.items }
                                    underline={true}
                                />
                            )
                        }
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

PurchaseRecordItem.propTypes = {
    purchaseItems: PropTypes.array
}