import Config from 'react-native-config';

// local storage key
export const KPHONENUMBER = '@kphonenumber'
export const KLASTNAME = '@klastname'
export const KFIRSTNAME = '@kfirstname'
export const KNRIC = '@knric'
export const KDOB = '@kdob'
export const KGUARDIANPERSON = '@kguardianperson'
export const KGUARDIANNUMBER = '@kguardiannumber'
export const KGUARDIANRELATIONSHIP = '@kguardianrelationship'
export const KEMERGENCYPERSON = '@kemergencyperson'
export const KEMERGENCYNUMBER = '@kemergencynumber'
export const KEMERGENCYRELATIONSHIP = '@kemergencyrelationship'
export const KAVATARURI = '@kavataruri'
export const KGENDER = '@kgender'
export const KEMAIL = '@kemail'
export const KADDRESS = '@kaddress'
export const KQUALIFICATION = '@kqualification'
export const KUSERID = '@kuserid'
export const KTOKEN = '@ktoken'
export const KSIGNUPDATE = '@ksignupdate'
export const KPDFURL = '@kpdfurl'
export const KFIRSTLOGIN = '@kfirstlogin'
export const KPASSES = '@kpasses'
export const KSHOECART = '@kshoecart'
export const KSHOEPRICE = '@kshoeprice'
export const KSOCKCART = '@ksockcart'
export const KSOCKPRICE = '@ksockprice'
export const KGEARCART = '@kgearcart'
export const KGEARPRICE = '@kgearprice'
export const KPASSCART = '@kpasscart'
export const KSEASONPASSPRICE = '@kseasonpassprice'
export const K5PASSPRICE = '@k5passprice'
export const K10PASSPRICE = '@k10passprice'
export const KDAYPASSPRICE = '@kdaypassprice'

// pass
export const MULTIPASSIN = "multipassin";
export const MULTIPASSOUT = "multipassout";
export const DAYPASSIN = "daypassin";
export const DAYPASSOUT = "daypassout";
export const SEASONPASSIN = "seasonpassin";
export const SEASONPASSOUT = "seasonpassout";
export const PROMOPASSIN = "promopassin";
export const PROMOPASSOUT = "promopassout";

export const VerificationPage = 0;
export const NamePage = 1;
export const NRICPage = 2;
export const DOBPage = 3;
export const EmergencyPage = 4;
export const SelfiePage = 5;

// CIMA tab
export const PASSESTAB = 0
export const PURCHASETAB = 1
export const USAGETAB = 2

// firebase
export const firebaseConfig = {
    appKey: "AIzaSyARoT-HdBwlHFcPdNkChqHxsBZufkkiDeQ",
    databaseURL: "https://cima-2ba6e.firebaseio.com",
    projectId: "cima-2ba6e",
    appId: "",    
};

// cart item type
export const CATEGORY_PASS = 'pass'
export const CATEGORY_SHOES = 'shoes'
export const CATEGORY_SOCKS = 'socks'
export const CATEGORY_GEAR = 'gear'

export const TYPE_MULTIPASS = 'multipass'
export const TYPE_SEASONPASS = 'seasonpass'
export const TYPE_DAYPASS = 'daypass'
export const TYPE_PROMOPASS = 'promopass'

export const VERIFICATION_LIMIT_NUMBER = 5

export const RELEASE_MODE = true