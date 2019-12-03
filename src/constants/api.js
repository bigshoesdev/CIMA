import Config from 'react-native-config';
import * as Configuration from '../constants/configuration'

var URL = "http://192.168.12.226:3000"
// var URL = "http://o13s.com:3000"
if (Configuration.RELEASE_MODE) {
    URL = "http://o13s.com:3000"
    // URL = "http://192.168.12.226:3000"
}
export const SERVER_URL = URL

export const API_URL = "/api"

export const SIGNUP = SERVER_URL + API_URL + "/user_signup"
export const SIGNIN = SERVER_URL + API_URL + "/user_login"

export const SEND_SMS = SERVER_URL + API_URL + "/send_sms"
export const VALIDATE_SMS = SERVER_URL + API_URL + "/validate_sms"

export const CHECKOUT = SERVER_URL + API_URL + "/checkout"

export const USERINFO = SERVER_URL + API_URL + "/userInfo"

export const GYMIN = SERVER_URL + API_URL + "/gymin"
export const GYMOUT = SERVER_URL + API_URL + "/gymout"

export const SCANQRCODE = SERVER_URL + API_URL + "/validate_turnstile"

export const VALIDATEQRCODE = SERVER_URL + API_URL + "/validate_qr"

export const SENDPDF = SERVER_URL + API_URL + "/send_email"

export const SENDFEEDBACK = SERVER_URL + API_URL + "/send_feedback"

export const GETRECORD = SERVER_URL + API_URL + "/getHistory"

export const CANCEL_SEASONPASS = SERVER_URL + API_URL + "/cancel_subscription"

export const VALIDATE_PASS = SERVER_URL + API_URL + "/validate_pass"

export const GET_EQUIPMENT = SERVER_URL + API_URL + "/getEquipmentCount"

export const OK = 1
export const FAILED = 0
export const ERROR = -1

export const SEASONPASS_TYPE = "season"
export const PROMOPASS_TYPE = "promo"
export const MULTIPASS_TYPE = "multi"
export const FIVEPASS_TYPE = 'multi_five'
export const TENPASS_TYPE = 'multi_ten'
export const DAYPASS_TYPE = "day"

export const SHOE_TYPE = 'shoe'
export const SOCK_TYPE = 'sock'
export const CHALKBAG_TYPE = 'chalkbag'