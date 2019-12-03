/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { View, AppRegistry } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { registerScreens } from './screens';
import configureStore from './store/configureStore';
import * as Storage from './Helper/Storage'

const store = configureStore();

registerScreens(store, Provider);

class App extends Component {
	constructor(props) {
		super(props);
		this.startApp();
	}

	async startApp() {
		let token = await Storage.getToken()

		if ( token === '' ) {
			Navigation.startSingleScreenApp({
				screen: {
					screen: 'Registration.PhonenumberPage'
				}
			})
		} else {
			Navigation.startSingleScreenApp({
				screen: {
					screen: 'Main.HomePage',
				}
			});
		}
	}
}

export default App;
