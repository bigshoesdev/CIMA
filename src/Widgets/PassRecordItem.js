import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,   
} from 'react-native';

import Styles from '../assets/styles/styles';
import * as Api from '../constants/api'
import * as CIMAService from '../Helper/CIMAService'
import * as Storage from '../Helper/Storage'

export default class PassRecordItem extends Component {
	constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.token = await Storage.getToken()
    }

    cancelSuccess = (res) => {
        console.log('server --> client(cancel season pass success): ', res.data)
    }

    cancelFailed = (err) => {
        console.log('server --> client(cancel season pass failed): ', err)
    }

    cancelSeasonPass = () => {
        var param = {
            user_id: this.userId,
            user_token: this.token,
        }

        console.log('client --> server: ', param)

        CIMAService.sendPostRequestAsync( Api.CANCEL_SEASONPASS, param, this.cancelSuccess, this.cancelFailed )
    }

	render() {
		return (
			<View style={ [style.container] } >
                {/* space */}
                <View style={ [Styles.normalSpace] } />

                {/* pass type */}
                <Text style={ [ Styles.largeFont, Styles.lightGrayColor] }>- ({this.props.quantity}) {this.props.passName}</Text>

                {/* validate date */}
                <Text style={ [ Styles.smallFont, Styles.lightGrayColor, this.props.type == Api.SEASONPASS_TYPE | this.props.type == Api.PROMOPASS_TYPE? Styles.hidden : Styles.visible] }>{this.props.from} - {this.props.to}</Text>

                {/* <TouchableOpacity style={ this.props.type == Api.SEASONPASS_TYPE? Styles.visible : Styles.hidden} key={1} onPress={() => this.cancelSeasonPass() }> */}
                    {/* space */}
                    {/* <View style={ [Styles.smallSpace] } /> */}
                    {/* pass type */}
                    {/* <Text style={ [ Styles.smallFont, Styles.redColor] }>Delete</Text>                     */}
                {/* </TouchableOpacity>  */}
                
            </View>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
})

PassRecordItem.propTypes = {
    type: PropTypes.string,
    passName: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    quantity: PropTypes.number
}