import * as types from '../constants/actionTypes';
import initialState from './initialState';

import * as Storage from '../Helper/Storage'

export default function (state = initialState.cima, action) {
	switch (action.type) {
		case types.AVATARURI_CHANGED:
			return {
				...state,
				avatarUri: action.avatarUri
			};
		case types.FIRSTNAME_CHANGED:
			return {
				...state,
				firstName: action.firstName
			};
		case types.LASTNAME_CHANGED:
			return {
				...state,
				lastName: action.lastName
			};
		case types.NRIC_CHANGED:
			return {
				...state,
				nric: action.nric
			};
		case types.DOB_CHANGED:
			return {
				...state,
				dob: action.dob
			};
		case types.GENDER_CHANGED:
			return {
				...state,
				gender: action.gender
			};
		case types.PHONENUMBER_CHANGED:
			return {
				...state,
				phoneNumber: action.phoneNumber
			};
		case types.EMAIL_CHANGED:
			return {
				...state,
				email: action.email
			};
		case types.ADDRESS_CHANGED:
			return {
				...state,
				address: action.address
			};

		// guardian/emergency
		case types.GUARDIANEMERGENCYPERSON_CHANGED:
			return {
				...state,
				guardianEmergencyPerson: action.guardianEmergencyPerson
			};
		case types.GUARDIANEMERGENCYNUMBER_CHANGED:
			return {
				...state,
				guardianEmergencyNumber: action.guardianEmergencyNumber
			};
		case types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED:
			return {
				...state,
				guardianEmergencyRelationship: action.guardianEmergencyRelationship
			};

		// qualification
		case types.QUALIFICATION_CHANGED:
			return {
				...state,
				qualification: action.qualification
			};

		case types.PERSONALINFO_CHANGED:
			return {
                ...state,
				personalInfo: action.personalInfo
			};
		case types.MULTIPASS_CHANGED:
			return {
                ...state,
				multiPassInfo: action.multiPassInfo
			};
		case types.DAYPASS_CHANGED:
			return {
                ...state,
				dayPassInfo: action.dayPassInfo
			};
		case types.SEASONPASS_CHANGED:
			return {
                ...state,
				seasonPassInfo: action.seasonPassInfo
			};
		case types.PROMOPASS_CHANGED:
			return {
                ...state,
				promoPassInfo: action.promoPassInfo
			};
		case types.PDFURL_CHANGED:
			return {
                ...state,
				pdfUrl: action.pdfUrl
			};
		case types.SHOECART_CHANGED:
			return {
                ...state,
				shoeCart: action.shoeCart
			};
		case types.SOCKCART_CHANGED:
			return {
                ...state,
				sockCart: action.sockCart
			};
		case types.GEARCART_CHANGED:
			return {
                ...state,
				gearCart: action.gearCart
			};
		case types.PASSCART_CHANGED:
			return {
                ...state,
				passCart: action.passCart
			};
		case types.TOTALPRICE_CHANGED:
			return {
                ...state,
				totalPrice: action.totalPrice
			};
		case types.PASSRECORDITEM_CHANGED:
			return {
                ...state,
				passRecordItems: action.passRecordItems
			};
		case types.PURCHASERECORDITEM_CHANGED:
			return {
                ...state,
				purchaseRecordItems: action.purchaseRecordItems
			};
		case types.USAGERECORDITEM_CHANGED:
			return {
                ...state,
				usageRecordItems: action.usageRecordItems
			};
		case types.EQUIPMENT_CHANGED:
			return {
                ...state,
				equipment: action.equipment
			};
		case types.VALIDPROMODATE_CHANGED:
			return {
                ...state,
				validPromoDate: action.validPromoDate
			};
		case types.USERINFOTHREADWORKING_CHANGED:
			return {
                ...state,
				userInfoThreadWorking: action.userInfoThreadWorking
			};
		default:
			return state;
	}
}
