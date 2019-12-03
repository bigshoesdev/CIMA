import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    ScrollView
} from 'react-native';

import Styles from '../assets/styles/styles';

import PassRecordItem from '../Widgets/PassRecordItem'

export default class PassesTabView extends Component {
	constructor(props) {
        super(props);
    }

	render() {
        const { passRecordItems } = this.props;

		return (
			<View style={ [style.container] } >
                <View style={ [Styles.normalMargin, style.container] } >
                    <Text style={ [Styles.normalPaddingTop, Styles.middleFont, Styles.lightGrayColor, style.youHaveText] }>You have:</Text>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* pass record items */}
                    <ScrollView style={style.scrollView}>
                        {
                            this.props.passItems.map((item, i) => 
                                <PassRecordItem
                                    key={i}
                                    type={item.type}
                                    passName={item.passName}
                                    from={item.from}
                                    to={item.to}
                                    quantity={item.quantity}
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
    youHaveText: {
        alignSelf: 'stretch'
    },
    scrollView: {
        alignSelf: 'stretch'
    }
})

PassesTabView.propTypes = {
    passItems: PropTypes.array
}
