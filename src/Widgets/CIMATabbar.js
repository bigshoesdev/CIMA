import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

// configuration
import * as Configuration from '../constants/configuration';

export default class CIMATabbar extends Component {
	constructor(props) {
        super(props);

        this.state = {
            tabIndex: Configuration.PASSESTAB
        }
    }

    passesTabPressed = () => {
        this.setState({
            tabIndex: Configuration.PASSESTAB
        })
    }

    purchaseTabPressed = () => {
        this.setState({
            tabIndex: Configuration.PURCHASETAB
        })
    }

    usageTabPressed = () => {
        this.setState({
            tabIndex: Configuration.USAGETAB
        })
    }

	render() {
		return (
			<View style={ [style.container] } >
                {/* Tab bar */}
                <View style={style.tabbar}>
                    {/* PASSES */}
                    <View style={[ this.state.tabIndex == Configuration.PASSESTAB ? style.activePassesTabBorder : style.inactivePassesTabBorder]}>
                        <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPress={() => this.passesTabPressed() }>
                            <View style={[Styles.centerInColumn, this.state.tabIndex == Configuration.PASSESTAB ? style.activePassesTab : style.inactivePassesTab]}>
                                <Text style={[Styles.textAlignCenter, this.state.tabIndex == Configuration.PASSESTAB ? style.activeTabTextColor : style.inactiveTabTextColor, Styles.middleFont]}>PASSES</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* PURCHASE */}
                    <View style={[ this.state.tabIndex == Configuration.PURCHASETAB ? style.activePurchaseTabBorder : style.inactivePurchaseTabBorder]}>
                        <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPress={() => this.purchaseTabPressed() }>
                            <View style={[Styles.centerInColumn, this.state.tabIndex == Configuration.PURCHASETAB ? style.activePurchaseTab : style.inactivePurchaseTab]}>
                                <Text style={[Styles.textAlignCenter, this.state.tabIndex == Configuration.PURCHASETAB ? style.activeTabTextColor : style.inactiveTabTextColor, Styles.middleFont]}>PURCHASE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* USAGE */}
                    <View style={[ this.state.tabIndex == Configuration.USAGETAB ? style.activeUsageTabBorder : style.inactiveUsageTabBorder]}>
                        <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPress={() => this.usageTabPressed() }>
                            <View style={[Styles.centerInColumn, this.state.tabIndex == Configuration.USAGETAB ? style.activeUsageTab : style.inactiveUsageTab]}>
                                <Text style={[Styles.textAlignCenter, this.state.tabIndex == Configuration.USAGETAB ? style.activeTabTextColor : style.inactiveTabTextColor, Styles.middleFont]}>USAGE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* View container */}
                <View style={style.viewContainer}>
                    {this.props.children[this.state.tabIndex]}
                </View>
            </View>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    tabbar: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: '#D8D8D8'
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    activePassesTabBorder: {
        height: 40,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#035561',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    inactivePassesTabBorder: {
        height: 40,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#035561',
        borderTopLeftRadius: 5,
    },
    activePurchaseTabBorder: {
        height: 40,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#035561',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    inactivePurchaseTabBorder: {
        height: 40,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#035561',
    },
    activeUsageTabBorder: {
        height: 40,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#035561',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    inactiveUsageTabBorder: {
        height: 40,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#035561',
        borderTopRightRadius: 5,
    },
    activePassesTab: {
        backgroundColor: 'white',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginRight: 1,
        marginTop: 1,
        flex: 1,
    },
    inactivePassesTab: {
        backgroundColor: '#D8D8D8',
        borderTopLeftRadius: 5,
        marginTop: 1,
        marginBottom: 1,
        flex: 1,
    },
    activePurchaseTab: {
        backgroundColor: 'white',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginLeft: 1,
        marginRight: 1,
        marginTop: 1,
        flex: 1,
    },
    inactivePurchaseTab: {
        backgroundColor: '#D8D8D8',
        marginTop: 1,
        marginBottom: 1,
        flex: 1,
    },    
    activeUsageTab: {
        backgroundColor: 'white',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginLeft: 1,
        marginTop: 1,
        flex: 1,
    },
    inactiveUsageTab: {
        backgroundColor: '#D8D8D8',
        borderTopRightRadius: 5,
        marginTop: 1,
        marginBottom: 1,
        flex: 1,        
    },
    activeTabTextColor: {
        color: '#D8D8D8',
    },
    inactiveTabTextColor: {
        color: 'white'
    }
})
