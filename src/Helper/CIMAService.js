
// configuration
import * as Api from '../constants/api'
import axios from 'axios'

export function sendPostRequestAsync( baseUrl, param, successCallback, errorCallback ) {
    axios.post(baseUrl, 
        {
            ...param
        }
    )
    .then(function (response) {
        successCallback(response)
    })
    .catch(function (error) {
        errorCallback(error)
    });
}

export function sendGetRequestAsync( baseUrl, param, successCallback, errorCallback ) {
    axios.get(baseUrl, {
        params:{
            ...param
        }
    })
    .then(function (response) {
        successCallback(response)
    })
    .catch(function (error) {
        errorCallback(error)
    });
}