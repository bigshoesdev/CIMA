import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import Styles from '../assets/styles/styles';
import * as Storage from '../Helper/Storage'

export default class CourseItem extends Component {
	constructor(props) {
        super(props);

        this.pdfUrl = ''
    }

    async componentDidMount() {
        this.pdfUrl = await Storage.getPDFUrl()
    }

	render() {
		return (
			<View style={ [style.container] } >
                {/* space */}
                <View style={ [Styles.smallSpace] } />

                {/* Item content */}
                <View style={style.itemContainer}>
                    {/* image */}
                    <View>
                        <TouchableOpacity onPress={() => this.props.onTapping() }>
                            <Image style={style.image} source={this.props.courseImage}/>
                        </TouchableOpacity>
                    </View>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* message */}
                    <Text style={ [style.message, Styles.smallFont, Styles.darkGreenColor] }>
                        {this.props.message}
                    </Text>
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
    image: {
        width: 70,
        height: 70
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    message: {
        flex: 1,
        alignSelf: 'stretch',
    },
})

CourseItem.propTypes = {
    courseImage: PropTypes.number,
    message: PropTypes.string,
    onTapping: PropTypes.func
}

CourseItem.propTypes = {
    courseImage: PropTypes.number,
    message: PropTypes.string,
    onTapping: PropTypes.func
}

CourseItem.defaultProps = {
    courseImage: 0,
    message: '',
    onTapping: null
}