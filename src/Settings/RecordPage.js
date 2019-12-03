import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ImageBackground,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles'

import Button from 'apsl-react-native-button'
import { Navigation } from 'react-native-navigation'

import CIMATabbar from '../Widgets/CIMATabbar'
import PassesTabView from './PassesTabView'
import PurchaseTabView from './PurchaseTabView'
import UsageTabView from './UsageTabView'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar';

import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'
import * as Storage from '../Helper/Storage'

import dateFormat from 'dateformat'

import firebase from 'react-native-firebase';

class RecordPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            isProgressVisible: false
        }
    }

    getRecordSuccess = (res) => {
        console.log( 'server --> client(getRecord success):', res.data )

        var passItems = []
        var purchaseItems = []
        var usageItems = []

        if (res.data.result == Api.OK) {
            this.hideProgress()
            
            // available passes
            res.data.pass.map((item, i) => {
                if (item.quantity < 1) {
                    return
                }
                var passName = ''
                if ( item.type == Api.SEASONPASS_TYPE ) {
                    passName = 'SEASON ' + (item.quantity > 1? 'PASSES':'PASS')
                } else if ( item.type == Api.MULTIPASS_TYPE ) {
                    passName = 'MULTI ' + (item.quantity > 1? 'PASSES':'PASS')
                } else if ( item.type == Api.DAYPASS_TYPE ) {
                    passName = 'DAY ' + (item.quantity > 1? 'PASSES':'PASS')
                } else if ( item.type == Api.PROMOPASS_TYPE ) {
                    passName = 'PROMO ' + (item.quantity > 1? 'PASSES':'PASS')
                }

                passItems = [
                    ...passItems,
                    {
                        type: item.type,
                        passName,
                        from: dateFormat(new Date(item.from), "dd mmm yyyy"),
                        to: dateFormat(new Date(item.to), "dd mmm yyyy"),
                        quantity: item.quantity
                    }
                ]
            }) // available passes

            // purchase history
            res.data.purchase.map((item, i) => {
                purchaseItems = [
                    ...purchaseItems,
                    {
                        date: dateFormat(new Date(item.timestamp), "dd mmm yyyy"),
                        items: item.detail
                    }
                ]
            })

            // usage history
            res.data.usage.map((item, i) => {
                var time = []
                
                item.detail.map((timeItem, i) => {
                    time = [
                        ...time,
                        new Date(timeItem.timestamp).getHours().toString() + ':' + new Date(timeItem.timestamp).getMinutes().toString() + 'h (' + timeItem.status + ')'
                    ]
                })

                var passType = []
                item.detail.map((passItem, i) => {
                    var passName = ''
                    if ( passItem.pass_type == Api.SEASONPASS_TYPE ) {
                        passName = 'SEASON'
                    } else if ( passItem.pass_type == Api.MULTIPASS_TYPE ) {
                        passName = 'MULTI'
                    } else if ( passItem.pass_type == Api.DAYPASS_TYPE ) {
                        passName = 'DAY'
                    } else if ( passItem.pass_type == Api.PROMOPASS_TYPE ) {
                        passName = 'PROMO'
                    }

                    passType = [
                        ...passType,
                        passName
                    ]
                })

                usageItems = [
                    ...usageItems,
                    {
                        date: dateFormat(new Date(item.timestamp), "dd mmm yyyy"),
                        time,
                        passType
                    }
                ]
            })
            
            this.props.actions.passRecordItemChanged( passItems )
            this.props.actions.purchaseRecordItemChanged( purchaseItems )
            this.props.actions.usageRecordItemChanged( usageItems )

        } else if (res.data.result == Api.FAILED) {
            this.hideProgress()
            this.refs.toast.show('Service Error');
        } else {
            Storage.setToken( '' )

            if (Platform.OS === "android") {
                this.hideProgress()
            }

            // firebase.auth().signOut();
            
            Navigation.startSingleScreenApp({
                screen: {
                    screen: 'Registration.PhonenumberPage',
                },
                appStyle: {
                    orientation: 'portrait',
                },
            });
        }
    }

    getRecordFailed = ( err ) => {
        this.hideProgress()
        console.log( 'server --> client(getRecord error):', err )
    }

    async componentDidMount() {
        this.showProgress()

        var param = {
            user_id: await Storage.getUserID(),
            user_token: await Storage.getToken()
        }

        console.log('client --> server: ', param)

        CIMAService.sendPostRequestAsync( Api.GETRECORD, param, this.getRecordSuccess, this.getRecordFailed)
    }

    showProgress = () => this.setState({ isProgressVisible: true })
    
    hideProgress = () => this.setState({ isProgressVisible: false })

	render() {
        let backgroundImage = require('../assets/images/background.png');
        const { passRecordItems, purchaseRecordItems, usageRecordItems } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container] } >
                    <View >
                        <Text style={ [style.recordColor, Styles.normalPaddingTop, Styles.largeFont, Styles.textAlignCenter] }>RECORD</Text>
                    </View>

                    {/* space */}
                    <View style={ [Styles.middleSpace] } />

                    {/* tab bar */}
                    <CIMATabbar>
                        <PassesTabView passItems={passRecordItems} />
                        <PurchaseTabView purchaseItems={purchaseRecordItems} />
                        <UsageTabView usageItems={usageRecordItems} />
                    </CIMATabbar>

                    <Toast ref="toast"/>

                    {/* progress dialog */}
                    <Modal isVisible={this.state.isProgressVisible}>
                        <View style={ [Styles.centerInColumn, ] }>
                            <ProgressBar />
                        </View>
                    </Modal>
                </View>
            </ImageBackground>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center'
    },
    recordColor: {
        color: '#0D4C6B'
    },
})

RecordPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
}

RecordPage.propTypes = {
	actions: PropTypes.object.isRequired,
    passRecordItems: PropTypes.array,
    purchaseRecordItems: PropTypes.array,
    usageRecordItems: PropTypes.array,
};

function mapStateToProps(state, ownProps) {
    return {
        passRecordItems: state.cima.passRecordItems,
        purchaseRecordItems: state.cima.purchaseRecordItems,
        usageRecordItems: state.cima.usageRecordItems
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordPage);