import * as Configuration from '../constants/configuration'

export default {
	cima: {
        avatarUri: '',
        firstName: '',
        lastName: '',
        nric: '',
        dob: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
        pdfUrl: '',

        // guardia/emergency
        guardianEmergencyPerson: '',
        guardianEmergencyNumber: '',
        guardianEmergencyRelationship: '',
        
        // qualification
        qualification: [],

        personalInfo: {
            avatarUri: '',
            firstName: '',
            lastName: '',
            nric: '',
            dob: '',
            gender: 'male',
            mobile: '',
            email: '',
            address: '',
        },

        multiPassInfo: {
            type: '',
            from: '',
            to: '',
            available: false,
            used: false
        },
        promoPassInfo: {
            type: '',
            from: '',
            to: '',
            available: false,
            used: false
        },
        dayPassInfo: {
            type: '',
            from: '',
            to: '',
            available: false,
            used: false
        },
        seasonPassInfo: {
            type: '',
            from: '',
            to: '',
            available: false,
            used: false
        },

        shoeCart: [],
        sockCart: {
            category: Configuration.CATEGORY_SOCKS,
            productName: 'Sock Rental',
            budget: 0,
            billUnit: 'SGD',
            infoKey: 'Size',
            infoValue: 'FREE',
            quantity: 0
        },
        gearCart: {
            category: Configuration.CATEGORY_GEAR,
            productName: 'Gear Rental',
            budget: 0,
            billUnit: 'SGD',
            infoKey: 'Size',
            infoValue: 'FREE',
            quantity: 0
        },
        passCart: [],

        totalPrice: 0,

        passRecordItems: [],
        purchaseRecordItems: [],
        usageRecordItems: [],
        
        equipment: [],
        validPromoDate: '',
        userInfoThreadWorking: false,
    }
};
