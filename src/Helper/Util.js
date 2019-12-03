import * as Storage from '../Helper/Storage'
import * as Configuration from '../constants/configuration';
import PhoneNumber from 'react-native-phone-input/lib/phoneNumber'

export function validatePhonenumber(value) {
    var re = /^\+\d{8,13}$/
    return re.test(value);
}

export function isLessThan18( from ) {
    var nowYear = new Date().getFullYear();
    var fromYear = new Date(from).getFullYear();

    return nowYear - fromYear <= 18
}

export function isPhonenumberEmpty( number ) {
    if ( number.length < 1 ) {
        return true
    }

    var phoneNumber = number
    if(phoneNumber[0] != '+')
        phoneNumber = `+${phoneNumber}`

    const dialCode = PhoneNumber.getDialCode(phoneNumber);
    if (dialCode == '') {
        return true
    }
    
    phoneNumber = phoneNumber.startsWith(dialCode + '0')? dialCode + phoneNumber.substr(dialCode.length + 1) : phoneNumber;

    return dialCode == phoneNumber
}

export function insertItem(array, action) {
    return [
        ...array.slice(0, action.index),
        action.item,
        ...array.slice(action.index)
    ]
}

export function appendItem( array, item ) {
    return [
        ...array,
        item
    ]
}

export function removeItem(array, action) {
    return [
        ...array.slice(0, action.index),
        ...array.slice(action.index + 1)
    ];
}

export function updateObjectInArray(array, action) {
    return array.map( (item, index) => {
        if(index !== action.index) {
            // This isn't the item we care about - keep it as-is
            return item;
        }

        // Otherwise, this is the one we want - return an updated value
        return {
            ...item,
            ...action.item
        };    
    });
}

export function getIndex(value, arr, prop) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][prop] === value) {
            return i;
        }
    }
    return -1; //to handle the case where the value doesn't exist
}

export function trimSpace( x ) {
    return x.replace(/\s/g, '');
}

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function validateAlphabetic(value) {
    var re = /^[a-zA-Z ]+$/
    return re.test(value);
}

export function validateAlphanumeric(value) {
    var re = /^[a-zA-Z0-9]+$/
    return re.test(value);
}

export async function resetStorage() {
    await Storage.setFirstName()
    await Storage.setLastName()
    await Storage.setNRIC()
    await Storage.setDOB()
    await Storage.setAvatarUri()
    await Storage.setGender()
    await Storage.setEmail()
    await Storage.setAddress()
    await Storage.setQualification()
    await Storage.setUserID()
    await Storage.setToken()
    await Storage.setPDFUrl()
    await Storage.setFirstLogin('true')
    await Storage.setPasses()
    await Storage.setShoeCart()
    value = {
        category: Configuration.CATEGORY_SOCKS,
        productName: 'Sock Rental',
        budget: 0,
        billUnit: 'SGD',
        infoKey: 'Size',
        infoValue: 'FREE',
        quantity: 0
    }
    await Storage.setSockCart( JSON.stringify(value) )
    value = {
        category: Configuration.CATEGORY_GEAR,
        productName: 'Gear Rental',
        budget: 0,
        billUnit: 'SGD',
        infoKey: 'Size',
        infoValue: 'FREE',
        quantity: 0
    }
    await Storage.setGearCart( JSON.stringify(value) )
    await Storage.setPassCart()
    await Storage.setEmergencyPerson()
    await Storage.setEmergencyNumber()
    await Storage.setEmergencyRelationship()
}

export async function resetAFewStorage() {
    await Storage.setFirstLogin('true')
    await Storage.setPasses()
    await Storage.setShoeCart()
    await Storage.setSockCart()
    value = {
        category: Configuration.CATEGORY_GEAR,
        productName: 'Gear Rental',
        budget: 0,
        billUnit: 'SGD',
        infoKey: 'Size',
        infoValue: 'FREE',
        quantity: 0
    }
    await Storage.setGearCart( JSON.stringify(value) )
    await Storage.setPassCart()
}