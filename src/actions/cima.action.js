import axios from 'axios';

import * as types from '../constants/actionTypes';
import { SERVER_URL } from '../constants/api';

//Phone number screen
export function sendPhoneNumber(phonenumber) {
	
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=phonenumber&data=" + phonenumber)
		.then(res => {
			dispatch(sendPhoneNumberSuccess(res));
		})
		.catch(error => {
			alert(error);
		})
	}
}

export function sendPhoneNumberSuccess(res) {
	return {
		type: types.SUBMIT_PHONENUMBER_SUCCESS,
		phonenumber: res.data
	};
}


//Full Name screen

export function submitFullNameSuccess(res) {
	return {
		type: types.SUBMIT_FULLNAME_SUCCESS,
		fullName: res.data
	};
}

export function submitFullName(first_name, last_name) {
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=phonenumber&data=" + 'test')
		.then(res => {
			dispatch(submitFullNameSuccess(res));
		})
		.catch(error => {
			console.log(error);
		})
	}
}

//Verification Screen
export function submitVerificationCodeSuccess(res) {
	return {
		type: types.SUBMIT_VERIFICATION_SUCCESS,
		verification: res.data
	};
}

export function submitVerificationCode(first_name, last_name) {
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=verification&data=" + 'test')
		.then(res => {
			dispatch(submitVerificationCodeSuccess(res));
		})
		.catch(error => {
			console.log(error);
		})
	}
}

//NRIC
export function sendNRIC(nric) {
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=nric&data=" + nric)
		.then(res => {
			dispatch(sendNRICSuccess(res));
		})
		.catch(error => {
			console.log(error);
		})
	}
}

export function sendNRICSuccess(res) {
	return {
		type: types.SUBMIT_NRIC_SUCCESS,
		nric: res.data
	};
}

//Birthday

export function submitBirthday(nric) {
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=nric&data=" + nric)
		.then(res => {
			dispatch(submitBirthdaySuccess(res));
		})
		.catch(error => {
			console.log(error);
		})
	}
}

export function submitBirthdaySuccess(res) {
	return {
		type: types.SUBMIT_BIRTHDAY_SUCCESS,
		nric: res.data
	};
}



//Emergency

export function submitEmergency(name, contact, relation) {
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=nric&data=" + name)
		.then(res => {
			dispatch(submitEmergencySuccess(res));
		})
		.catch(error => {
			console.log(error);
		})
	}
}

export function submitEmergencySuccess(res) {
	return {
		type: types.SUBMIT_EMERGENCY_SUCCESS,
		contact: res.data
	};
}

//Profile Photo

export function submitProfilePhoto(name) {
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=profile&data=" + name)
		.then(res => {
			dispatch(submitProfilePhotoSuccess(res));
		})
		.catch(error => {
			console.log(error);
		})
	}
}

export function submitProfilePhotoSuccess(res) {
	return {
		type: types.SUBMIT_PROFILE_PHOTO_SUCCESS,
		contact: res.data
	};
}




//Guardian Name

export function submitGuardianName(name) {
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=profile&data=" + name)
		.then(res => {
			dispatch(submitGuardianNameSuccess(res));
		})
		.catch(error => {
			console.log(error);
		})
	}
}

export function submitGuardianNameSuccess(res) {
	return {
		type: types.SUBMIT_GUARDIAN_NAME_SUCCESS,
		contact: res.data
	};
}


//Guardian Contact

export function submitGuardianContact(name) {
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=profile&data=" + name)
		.then(res => {
			dispatch(submitGuardianContactSuccess(res));
		})
		.catch(error => {
			console.log(error);
		})
	}
}

export function submitGuardianContactSuccess(res) {
	return {
		type: types.SUBMIT_GUARDIAN_CONTACT_SUCCESS,
		contact: res.data
	};
}

//Guardian Relation

export function submitGuardianRelation(name) {
	return function (dispatch) {
		return axios.get(SERVER_URL + "?page=profile&data=" + name)
		.then(res => {
			dispatch(submitGuardianRelationSuccess(res));
		})
		.catch(error => {
			console.log(error);
		})
	}
}

export function submitGuardianRelationSuccess(res) {
	return {
		type: types.SUBMIT_GUARDIAN_RELATION_SUCCESS,
		contact: res.data
	};
}

export function avatarUriChanged( avatarUri ) {
	return (dispatch) => {
		dispatch({ 
			type: types.AVATARURI_CHANGED,
			avatarUri
		});
	};
}

export function firstNameChanged( firstName ) {
	return (dispatch) => {
		dispatch({ 
			type: types.FIRSTNAME_CHANGED,
			firstName
		});
	};
}

export function lastNameChanged( lastName ) {
	return (dispatch) => {
		dispatch({ 
			type: types.LASTNAME_CHANGED,
			lastName
		});
	};
}

export function nricChanged( nric ) {
	return (dispatch) => {
		dispatch({ 
			type: types.NRIC_CHANGED,
			nric
		});
	};
}

export function dobChanged( dob ) {
	return (dispatch) => {
		dispatch({ 
			type: types.DOB_CHANGED,
			dob
		});
	};
}

export function genderChanged( gender ) {
	return (dispatch) => {
		dispatch({ 
			type: types.GENDER_CHANGED,
			gender
		});
	};
}

export function phoneNumberChanged( phoneNumber ) {
	return (dispatch) => {
		dispatch({ 
			type: types.PHONENUMBER_CHANGED,
			phoneNumber
		});
	};
}

export function emailChanged( email ) {
	return (dispatch) => {
		dispatch({ 
			type: types.EMAIL_CHANGED,
			email
		});
	};
}

export function addressChanged( address ) {
	return (dispatch) => {
		dispatch({ 
			type: types.ADDRESS_CHANGED,
			address
		});
	};
}

export function guardianEmergencyPersonChanged( guardianEmergencyPerson ) {
	return (dispatch) => {
		dispatch({ 
			type: types.GUARDIANEMERGENCYPERSON_CHANGED,
			guardianEmergencyPerson
		});
	};
}

export function guardianEmergencyNumberChanged( guardianEmergencyNumber ) {
	return (dispatch) => {
		dispatch({ 
			type: types.GUARDIANEMERGENCYNUMBER_CHANGED,
			guardianEmergencyNumber
		});
	};
}

export function guardianEmergencyRelationshipChanged( guardianEmergencyRelationship ) {
	return (dispatch) => {
		dispatch({ 
			type: types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED,
			guardianEmergencyRelationship
		});
	};
}

export function qualificationChanged( qualification ) {
	return (dispatch) => {
		dispatch({ 
			type: types.QUALIFICATION_CHANGED,
			qualification
		});
	};
}

// Personal info changed
export function personalInfoChanged( personalInfo ) {
	return (dispatch) => {
		dispatch({ 
			type: types.PERSONALINFO_CHANGED,
			personalInfo
		});
	};
}

// Multi pass changed
export function multiPassChanged( multiPassInfo ) {
	return (dispatch) => {
		dispatch({ 
			type: types.MULTIPASS_CHANGED,
			multiPassInfo
		});
	};
}

// Season pass changed
export function seasonPassChanged( seasonPassInfo ) {
	return (dispatch) => {
		dispatch({ 
			type: types.SEASONPASS_CHANGED,
			seasonPassInfo
		});
	};
}

// Day pass changed
export function dayPassChanged( dayPassInfo ) {
	return (dispatch) => {
		dispatch({ 
			type: types.DAYPASS_CHANGED,
			dayPassInfo
		});
	};
}

// Promo pass changed
export function promoPassChanged( promoPassInfo ) {
	return (dispatch) => {
		dispatch({ 
			type: types.PROMOPASS_CHANGED,
			promoPassInfo
		});
	};
}

// PDF url
export function pdfUrlChanged( pdfUrl ) {
	return (dispatch) => {
		dispatch({ 
			type: types.PDFURL_CHANGED,
			pdfUrl
		});
	};
}

// Shoe Cart
export function shoeCartChanged( shoeCart ) {
	return (dispatch) => {
		dispatch({ 
			type: types.SHOECART_CHANGED,
			shoeCart
		});
	};
}

// Sock cart
export function sockCartChanged( sockCart ) {
	return (dispatch) => {
		dispatch({ 
			type: types.SOCKCART_CHANGED,
			sockCart
		});
	};
}

// Gear cart
export function gearCartChanged( gearCart ) {
	return (dispatch) => {
		dispatch({ 
			type: types.GEARCART_CHANGED,
			gearCart
		});
	};
}

// Pass cart
export function passCartChanged( passCart ) {
	return (dispatch) => {
		dispatch({ 
			type: types.PASSCART_CHANGED,
			passCart
		});
	};
}

// Total price
export function totalPriceChanged( totalPrice ) {
	return (dispatch) => {
		dispatch({ 
			type: types.TOTALPRICE_CHANGED,
			totalPrice
		});
	};
}

// passRecordItemChanged
export function passRecordItemChanged( passRecordItems ) {
	return (dispatch) => {
		dispatch({ 
			type: types.PASSRECORDITEM_CHANGED,
			passRecordItems
		});
	};
}

// purchaseRecordItem
export function purchaseRecordItemChanged( purchaseRecordItems ) {
	return (dispatch) => {
		dispatch({ 
			type: types.PURCHASERECORDITEM_CHANGED,
			purchaseRecordItems
		});
	};
}

// Total price
export function usageRecordItemChanged( usageRecordItems ) {
	return (dispatch) => {
		dispatch({ 
			type: types.USAGERECORDITEM_CHANGED,
			usageRecordItems
		});
	};
}

// Equipment
export function equipmentChanged( equipment ) {
	return (dispatch) => {
		dispatch({ 
			type: types.EQUIPMENT_CHANGED,
			equipment
		});
	};
}

// Equipment
export function validPromoDateChanged( validPromoDate ) {
	return (dispatch) => {
		dispatch({ 
			type: types.VALIDPROMODATE_CHANGED,
			validPromoDate
		});
	};
}

// User info thread working
export function userInfoThreadWorkingChanged( userInfoThreadWorking ) {
	return (dispatch) => {
		dispatch({ 
			type: types.VALIDPROMODATE_CHANGED,
			userInfoThreadWorking
		});
	};
}