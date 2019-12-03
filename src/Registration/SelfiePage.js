import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import { Icon } from 'react-native-elements'
import Button from 'apsl-react-native-button'
import ImagePicker from 'react-native-image-picker'
import * as Storage from '../Helper/Storage'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SelfiePage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            enableNextButton: false
        };

        this.openImagePicker = this.openImagePicker.bind(this);
    }

    async componentDidMount() {
        // personal info
        avatarUri = await Storage.getAvatarUri()
        this.props.actions.avatarUriChanged( avatarUri )

        this.setState({
            enableNextButton: avatarUri.length > 0
        })
    }

    goNextPage() {
        if (!this.state.enableNextButton) {
            return;
        }

        Storage.setAvatarUri( this.props.avatarUri )

        this.props.navigator.push({
            screen: 'Registration.SummaryPage',
        });
    }

    openImagePicker( e ) {        
        var options = {
            title: 'Select Avatar',
            storageOptions: {
				skipBackup: true,
				path: 'images'
            },
            mediaType: 'photo',
            allowsEditing: true,
            quality: 0.5,
            maxHeight: 250,
            maxWidth: 250
        };
        
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
          
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.props.actions.avatarUriChanged( response.uri )
                this.setState({
                    enableNextButton: true
                });
            }
		});
    }

    onAvatarError = () => {
        this.props.actions.avatarUriChanged( '' )
    }

	render() {
        let avartarImage = require('../assets/images/avatar1.png');

        const { avatarUri } = this.props;

		return (
            <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >
                <View style={ [ style.container] } >
                    {/* Selfie */}
                    <View style={style.avartarImage}>
                        <TouchableOpacity onPress={() => this.openImagePicker() }>
                            { 
                                avatarUri == '' || avatarUri.startsWith('http') ? 
                                <Icon name="user"
                                    type="entypo"
                                    size={moderateScale(200)}
                                    color="#d8d8d8"
                                />
                                    :
                                <Image 
                                    style={style.avartarImage} 
                                    source={ {uri: avatarUri} } 
                                    onError={ this.onAvatarError }
                                />
                            }
                        </TouchableOpacity>
                    </View>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />
                    
                    {/* Emergency Contact Number */}
                    <View style={ [Styles.centerInColumn, style.comment] }>
                        <Text style={ [Styles.smallFont, Styles.lightGrayColor, Styles.textAlignCenter] } >Please include a self portrait, that will be used for verification at the gym.</Text>
                    </View>
                </View>

                {/* indicator */}
                <View style={style.indicatorContainer}>
                    <Icon name="dot-single"
                        type="entypo"
                        size={moderateScale(50)}
                        color='#d8d8d8'
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={moderateScale(50)}
                        color='#d8d8d8'
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={moderateScale(50)}
                        color='#d8d8d8'
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={moderateScale(50)}
                        color='#d8d8d8'
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={moderateScale(50)}
                        color='#d8d8d8'
                    />
                    <Icon name="dot-single"
                        type="entypo"
                        size={moderateScale(50)}
                        color='#5EC3AE'
                    />
                </View>

                {/* next button */}
                <Button
                    textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                    style={ this.state.enableNextButton? Styles.activeButton: Styles.inactiveButton}
                    activeOpacity={this.state.enableNextButton? 0.5:1}
                    onPress={() => this.goNextPage()} >
                    NEXT
                </Button>
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
        alignSelf: 'stretch'
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avartarImage: {
        width: moderateScale(200),
        height: moderateScale(200),
        borderWidth: 2,
        borderColor: '#d8d8d8'
    },    
    comment: {
        height: moderateScale(40)
    }
})

SelfiePage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

SelfiePage.propTypes = {
    actions: PropTypes.object.isRequired,
    avatarUri: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        avatarUri: state.cima.avatarUri
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SelfiePage);