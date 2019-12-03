import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { registerScreens } from './screens';
import configureStore from './store/configureStore';
import * as Storage from './Helper/Storage'

const store = configureStore();

registerScreens(store, Provider);

Storage.getToken().then((token) => {
	if ( token === '' ) {
		Navigation.startSingleScreenApp({
			screen: {
				screen: 'Registration.PhonenumberPage',
			},
			appStyle: {
				orientation: 'portrait',
			},
		})
	} else {
		Navigation.startSingleScreenApp({
			screen: {
				screen: 'Main.HomePage'
			},
			appStyle: {
				orientation: 'portrait',
			},
		});
	}
}).catch((err) => {
	console.log('token error: ', err)
})


