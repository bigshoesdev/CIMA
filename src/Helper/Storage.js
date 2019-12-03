import {
    AsyncStorage
} from 'react-native';

import * as Configuration from '../constants/configuration';

// phone number
export async function setPhonenumber(phoneNumber = '') {
    try {
        await AsyncStorage.setItem(Configuration.KPHONENUMBER, phoneNumber);
    } catch (error) {
        // Error saving data
        console.log( 'set phone number error - ' + error )
    }
}

export async function getPhonenumber() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KPHONENUMBER );
        if (value === null){
          value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get phone number error - ' + error )
    }
}

// first name
export async function setFirstName(firstName = '') {
    try {
        await AsyncStorage.setItem(Configuration.KFIRSTNAME, firstName);
    } catch (error) {
        // Error saving data
        console.log( 'set firstName error - ' + error )
    }
}

export async function getFirstName() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KFIRSTNAME );
        if (value === null){
          value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get first name error - ' + error )
    }
}

// last name
export async function setLastName(lastName = '') {
    try {
        await AsyncStorage.setItem(Configuration.KLASTNAME, lastName);
    } catch (error) {
        // Error saving data
        console.log( 'set lastName error - ' + error )
    }
}

export async function getLastName() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KLASTNAME );
        if (value === null){
          value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get lastName error - ' + error )
    }
}

// NRIC
export async function setNRIC(nric = '') {
    try {
        await AsyncStorage.setItem(Configuration.KNRIC, nric);
    } catch (error) {
        // Error saving data
        console.log( 'set nric error - ' + error )
    }
}

export async function getNRIC() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KNRIC );
        if (value === null){
          value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get NRIC error - ' + error )
    }
}

// Day of birth
export async function setDOB(dob = '') {
    try {
        await AsyncStorage.setItem(Configuration.KDOB, dob);
    } catch (error) {
        // Error saving data
        console.log( 'set DOB error - ' + error )
    }
}

export async function getDOB() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KDOB );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get DOB error - ' + error )
    }
}

// Emergency Person
export async function setEmergencyPerson(person = '') {
    try {
        await AsyncStorage.setItem(Configuration.KEMERGENCYPERSON, person);
    } catch (error) {
        // Error saving data
        console.log( 'set Emergency person error - ' + error )
    }
}

export async function getEmergencyPerson() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KEMERGENCYPERSON );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Emergency Person error - ' + error )
    }
}

// Guardian Number
export async function setEmergencyNumber(number = '') {
    try {
        await AsyncStorage.setItem(Configuration.KEMERGENCYNUMBER, number);
    } catch (error) {
        // Error saving data
        console.log( 'set Emergency number error - ' + error )
    }
}

export async function getEmergencyNumber() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KEMERGENCYNUMBER );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Emergency Number error - ' + error )
    }
}

// Guardian Relationship
export async function setEmergencyRelationship(relationship = '') {
    try {
        await AsyncStorage.setItem(Configuration.KEMERGENCYRELATIONSHIP, relationship);
    } catch (error) {
        // Error saving data
        console.log( 'set Emergency relationship error - ' + error )
    }
}

export async function getEmergencyRelationship() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KEMERGENCYRELATIONSHIP );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Emergency relationship error - ' + error )
    }
}

// Avatar
export async function setAvatarUri(uri = '') {
    try {
        await AsyncStorage.setItem(Configuration.KAVATARURI, uri);
    } catch (error) {
        // Error saving data
        console.log( 'set Avatar error - ' + error )
    }
}

export async function getAvatarUri() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KAVATARURI );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Avatar error - ' + error )
    }
}

// Gender
export async function setGender(gender = '') {
    try {
        await AsyncStorage.setItem(Configuration.KGENDER, gender);
    } catch (error) {
        // Error saving data
        console.log( 'set gender error - ' + error )
    }
}

export async function getGender() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KGENDER );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Gender error - ' + error )
    }
}

// Email
export async function setEmail(email = '') {
    try {
        await AsyncStorage.setItem(Configuration.KEMAIL, email);
    } catch (error) {
        // Error saving data
        console.log( 'set email error - ' + error )
    }
}

export async function getEmail() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KEMAIL );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Email error - ' + error )
    }
}

// Address
export async function setAddress(address = '') {
    try {
        await AsyncStorage.setItem(Configuration.KADDRESS, address);
    } catch (error) {
        // Error saving data
        console.log( 'set Address error - ' + error )
    }
}

export async function getAddress() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KADDRESS );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Address error - ' + error )
    }
}

// Qualification
export async function setQualification(qualification = '[]') {
    try {
        await AsyncStorage.setItem(Configuration.KQUALIFICATION, qualification);
    } catch (error) {
        // Error saving data
        console.log( 'set Qualification error - ' + error )
    }
}

export async function getQualification() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KQUALIFICATION );
        if (value === null){
            value = '[]'
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Qualification error - ' + error )
    }
}

// user id
export async function setUserID(userId = '') {
    try {
        await AsyncStorage.setItem(Configuration.KUSERID, userId);
    } catch (error) {
        // Error saving data
        console.log( 'set User ID error - ' + error )
    }
}

export async function getUserID() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KUSERID );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get User ID error - ' + error )
    }
}

// token
export async function setToken(token = '') {
    try {
        await AsyncStorage.setItem(Configuration.KTOKEN, token);
    } catch (error) {
        // Error saving data
        console.log( 'set Token error - ' + error )
    }
}

export async function getToken() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KTOKEN );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Token error - ' + error )
    }
}

// signup date
export async function setSignupDate(date = '0') {
    try {
        await AsyncStorage.setItem(Configuration.KSIGNUPDATE, date);
    } catch (error) {
        // Error saving data
        console.log( 'set Signup Date error - ' + error )
    }
}

export async function getSignupDate() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KSIGNUPDATE );
        if (value === null){
            value = '0'
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Signup date error - ' + error )
    }
}

// PDF
export async function setPDFUrl(url = '') {
    try {
        await AsyncStorage.setItem(Configuration.KPDFURL, url);
    } catch (error) {
        // Error saving data
        console.log( 'set PDF Url error - ' + error )
    }
}

export async function getPDFUrl() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KPDFURL );
        if (value === null){
            value = ''
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get PDF Url error - ' + error )
    }
}

// First Login
export async function setFirstLogin(firstLogin = 'false') {
    try {
        await AsyncStorage.setItem(Configuration.KFIRSTLOGIN, firstLogin);
    } catch (error) {
        // Error saving data
        console.log( 'set First Login error - ' + error )
    }
}

export async function getFirstLogin() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KFIRSTLOGIN );
        if (value === null){
            value = 'true'
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get First Login error - ' + error )
    }
}

// Pass
export async function setPasses(passes = '[]') {
    try {
        await AsyncStorage.setItem(Configuration.KPASSES, passes);
    } catch (error) {
        // Error saving data
        console.log( 'set Pass error - ' + error )
    }
}

export async function getPasses() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KPASSES );
        if (value === null){
            value = '[]'
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Pass error - ' + error )
    }
}

// Shoe Cart
export async function setShoeCart(shoeCart = '[]') {
    try {
        await AsyncStorage.setItem(Configuration.KSHOECART, shoeCart);
    } catch (error) {
        // Error saving data
        console.log( 'set Shoe cart error - ' + error )
    }
}

export async function getShoeCart() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KSHOECART );
        if (value === null){
            value = '[]'
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Shoe cart error - ' + error )
    }
}

// Sock Cart
export async function setSockCart(sockCart = '') {
    try {
        await AsyncStorage.setItem(Configuration.KSOCKCART, sockCart);
    } catch (error) {
        // Error saving data
        console.log( 'set sock cart error - ' + error )
    }
}

export async function getSockCart() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KSOCKCART );
        if (value === null){
            var item = {
                category: Configuration.CATEGORY_SOCKS,
                productName: 'Sock Rental',
                budget: 0,
                billUnit: 'SGD',
                infoKey: 'Size',
                infoValue: 'FREE',
                quantity: 0
            }
            value = JSON.stringify(item)
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Sock cart error - ' + error )
    }
}

// Gear Cart
export async function setGearCart(gearCart = '') {
    try {
        await AsyncStorage.setItem(Configuration.KGEARCART, gearCart);
    } catch (error) {
        // Error saving data
        console.log( 'set gear cart error - ' + error )
    }
}

export async function getGearCart() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KGEARCART );
        if (value === null) {
            value = {
                category: Configuration.CATEGORY_GEAR,
                productName: 'Gear Rental',
                budget: 0,
                billUnit: 'SGD',
                infoKey: 'Size',
                infoValue: 'FREE',
                quantity: 0
            }
            value = JSON.stringify(value)
        }
        
        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Gear cart error - ' + error )
    }
}

// Season Cart
export async function setPassCart(passCart  = '[]') {
    try {
        await AsyncStorage.setItem(Configuration.KPASSCART, passCart);
    } catch (error) {
        // Error saving data
        console.log( 'set passCart error - ' + error )
    }
}

export async function getPassCart() {
    try {
        const value = await AsyncStorage.getItem( Configuration.KPASSCART );
        if (value === null){
            value = '[]'
        }

        return value
    } catch (error) {
        // Error retrieving data
        console.log( 'get Pass cart error - ' + error )
    }
}