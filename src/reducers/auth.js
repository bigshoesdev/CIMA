import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState, action) {
	switch (action.type) {
		case types.SUBMIT_PHONENUMBER_SUCCESS:
			return {
				...state,
				phonenumber: action.phonenumber
			};
			break;
		case types.SUBMIT_FULLNAME_SUCCESS:
			return {
				...state
				// action.fullName
			};
			break;
		default:
			return state;
	}
}
