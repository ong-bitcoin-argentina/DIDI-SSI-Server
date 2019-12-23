const DEBUGG = process.env.DEBUGG_MODE || true;
const MONGO_DIR = process.env.MONGO_DIR || "127.0.0.1";
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const MONGO_USER = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB || "didi";
const PORT = process.env.PORT || 3000;

const SERVER_DID = process.env.SERVER_DID || "***REMOVED***";
const SERVER_PRIVATE_KEY =
	process.env.SERVER_PRIVATE_KEY || "***REMOVED***";

const MOURO_URL = process.env.MOURO_URL || "http://192.168.2.113:3001/graphql";

const URL = MONGO_DIR + ":" + MONGO_PORT + "/" + MONGO_DB;
const MONGO_URL =
	MONGO_USER && MONGO_PASSWORD ? "mongodb://" + MONGO_USER + ":" + MONGO_PASSWORD + "@" + URL : "mongodb://" + URL;

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || "***REMOVED***";
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "***REMOVED***";

const TWILIO_SID = process.env.TWILIO_SID || "***REMOVED***";
const TWILIO_TOKEN = process.env.TWILIO_TOKEN || "***REMOVED***";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "***REMOVED***";
const PHONE_REGION = process.env.PHONE_REGION || "+54911";

const SERVER_IP = process.env.SERVER_IP || "192.168.2.137";
const RENAPER_SCORE_TRESHOULD = process.env.RENAPER_SCORE_TRESHOULD || "75";
const RENAPER_API_KEY = process.env.RENAPER_API_KEY || "***REMOVED***";
const RENAPER_API = process.env.RENAPER_API || "https://renaperpreprod.dnm.gob.ar/";
const RENAPER_URL =
	process.env.RENAPER_URL || "http://onboarding.renaper.prod.vusecurity.com:8080/vu-onboarding-rest/onboarding/";

const FINGER_PRINT_DATA =
	process.env.FINGER_PRINT_DATA ||
	"***REMOVED***";

module.exports = {
	API_VERSION: "1.0",
	DEBUGG: DEBUGG,
	MONGO_URL: MONGO_URL,
	PORT: PORT,

	RENAPER_API_KEY: RENAPER_API_KEY,
	RENAPER_API: RENAPER_API,
	RENAPER_SCORE_TRESHOULD: RENAPER_SCORE_TRESHOULD,

	FINGER_PRINT_DATA: FINGER_PRINT_DATA,
	RENAPER_APP_VERS: "1.0.0",
	RENAPER_ANALYZE_ANOMALIES: false,
	RENAPER_ANALYZE_OCR: false,
	SERVER_IP: SERVER_IP,

	RENAPER_URLS: {
		SCAN_BAR_CODE: RENAPER_URL + "/scanBarcode",
		NEW_OPERATION: RENAPER_URL + "/newOperation",
		ADD_FRONT: RENAPER_URL + "/addFront",
		ADD_BACK: RENAPER_URL + "/addBack",
		ADD_SELFIE: RENAPER_URL + "/register",
		ADD_BAR_CODE: RENAPER_URL + "/addBarcode",
		END_OPERATION: RENAPER_URL + "/endOperation"
	},

	MOURO_URL: MOURO_URL,
	SERVER_DID: SERVER_DID,
	SERVER_PRIVATE_KEY: SERVER_PRIVATE_KEY,
	CREDENTIALS: {
		TYPES: {
			VERIFIABLE: "VerifiableCredential"
		},
		CONTEXT: "https://www.w3.org/2018/credentials/v1"
	},

	VALIDATION_TYPES: {
		IS_MOBILE_PHONE: "isMobilePhone",
		IS_EMAIL: "isEmail",
		IS_STRING: "isString",
		IS_DATE_TIME: "isDateTime",
		IS_BOOLEAN: "isBoolean",
		IS_PASSWORD: "isPassword",
		IS_BASE_64_IMAGE: "isBase64Image",
		IS_FINGER_PRINT: "isFingerPrint",
		IS_NUMBER: "isNumber",
		IS_DNI: "isDni",
		IS_IP: "isIp"
	},

	MAILGUN_API_KEY: MAILGUN_API_KEY,
	MAILGUN_DOMAIN: MAILGUN_DOMAIN,

	TWILIO_SID: TWILIO_SID,
	TWILIO_TOKEN: TWILIO_TOKEN,
	TWILIO_PHONE_NUMBER: TWILIO_PHONE_NUMBER,
	PHONE_REGION: PHONE_REGION,

	RECOVERY_CODE_LENGTH: 6,
	HOURS_BEFORE_CODE_EXPIRES: 1,

	SALT_WORK_FACTOR: 16,
	PASSWORD_MIN_LENGTH: 6,
	COMMON_PASSWORDS: ["123456", "contraseña", "password"],

	AUTHENTICATION_REQUEST: {
		IN_PROGRESS: "In Progress",
		SUCCESSFUL: "Successful",
		FALIED: "Falied"
	}
};
