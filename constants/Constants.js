const DEBUGG = process.env.DEBUGG_MODE === "true";
const MONGO_DIR = process.env.MONGO_DIR;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_USER = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

const ADDRESS = process.env.ADDRESS;
const PORT = process.env.PORT;

const SERVER_DID = process.env.SERVER_DID;
const SERVER_PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY;

const ISSUER_SERVER_DID = process.env.ISSUER_SERVER_DID; // TODO: quitar cuando se resuelva el problema de los nombres de issuers
const ISSUER_SERVER_NAME = process.env.ISSUER_SERVER_NAME; // TODO: quitar cuando se resuelva el problema de los nombres de issuers

const MOURO_URL = process.env.MOURO_URL;

const URL = MONGO_DIR + ":" + MONGO_PORT + "/" + MONGO_DB;
const MONGO_URL =
	MONGO_USER && MONGO_PASSWORD ? "mongodb://" + MONGO_USER + ":" + MONGO_PASSWORD + "@" + URL : "mongodb://" + URL;

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const SERVER_IP = process.env.SERVER_IP;
const RENAPER_SCORE_TRESHOULD = process.env.RENAPER_SCORE_TRESHOULD;
const RENAPER_API_KEY = process.env.RENAPER_API_KEY;
const RENAPER_API = process.env.RENAPER_API;
const RENAPER_URL = process.env.RENAPER_URL;

const FINGER_PRINT_DATA = process.env.FINGER_PRINT_DATA;

const NO_EMAILS = process.env.NO_EMAILS === "true";
const NO_SMS = process.env.NO_SMS === "true";

const BLOCK_CHAIN_URL = process.env.BLOCK_CHAIN_URL;
const BLOCK_CHAIN_CONTRACT = process.env.BLOCK_CHAIN_CONTRACT;
const DELEGATE_DURATION = process.env.BLOCK_CHAIN_DELEGATE_DURATION || 1300000;

const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY;
const HASH_SALT = process.env.HASH_SALT;

const FIREBASE_URL = process.env.FIREBASE_URL;
const FIREBASE_PRIV_KEY_PATH = process.env.FIREBASE_PRIV_KEY_PATH;

const SEMILLAS_URL = process.env.SEMILLAS_URL;

module.exports = {
	DIDI_SERVER_NAME: "Didi Server",

	API_VERSION: "1.0",
	DEBUGG: DEBUGG,
	MONGO_URL: MONGO_URL,
	ADDRESS: ADDRESS,
	PORT: PORT,

	RSA_PRIVATE_KEY: RSA_PRIVATE_KEY,
	HASH_SALT: HASH_SALT,

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
	ISSUER_SERVER_DID: ISSUER_SERVER_DID, // TODO: quitar cuando se resuelva el problema de los nombres de issuers
	ISSUER_SERVER_NAME: ISSUER_SERVER_NAME, // TODO: quitar cuando se resuelva el problema de los nombres de issuers
	CREDENTIALS: {
		TYPES: {
			VERIFIABLE: "VerifiableCredential"
		},
		CONTEXT: "https://www.w3.org/2018/credentials/v1"
	},

	VALIDATION_TYPES: {
		IS_AUTH_TOKEN: "IsAuthToken",
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

	RECOVERY_CODE_LENGTH: 6,
	HOURS_BEFORE_CODE_EXPIRES: 1,

	SALT_WORK_FACTOR: 16,
	PASSWORD_MIN_LENGTH: 6,
	COMMON_PASSWORDS: ["123456", "contraseña", "password"],

	AUTHENTICATION_REQUEST: {
		IN_PROGRESS: "In Progress",
		SUCCESSFUL: "Successful",
		FALIED: "Falied"
	},

	CERTIFICATE_NAMES: {
		EMAIL: "EMAIL",
		TEL: "TEL",
		USER_INFO: "USER_INFO",
		USER_ADDRESS: "USER_ADDRESS",
		GENERIC: "GENERIC"
	},

	CERTIFICATE_STATUS: {
		UNVERIFIED: "UNVERIFIED",
		VERIFIED: "VERIFIED",
		REVOKED: "REVOKED"
	},

	BLOCKCHAIN: {
		BLOCK_CHAIN_URL: BLOCK_CHAIN_URL,
		BLOCK_CHAIN_CONTRACT: BLOCK_CHAIN_CONTRACT,
		DELEGATE_DURATION: DELEGATE_DURATION
	},

	FIREBASE_URL: FIREBASE_URL,
	FIREBASE_PRIV_KEY_PATH: FIREBASE_PRIV_KEY_PATH,

	NO_EMAILS: NO_EMAILS,
	NO_SMS: NO_SMS,

	SEMILLAS_LOGIN: {
		username: process.env.SEMILLAS_USERNAME,
		password: process.env.SEMILLAS_PASSWORD
	},
	SEMILLAS_URL,
	SEMILLAS_URLS: {
		LOGIN: `${SEMILLAS_URL}/auth/login`,
		CREDENTIALS_DIDI: `${SEMILLAS_URL}/credentials/didi`,
		VALIDATE_DNI: `${SEMILLAS_URL}/identityValidationRequests`,
		SHARE_DATA: `${SEMILLAS_URL}/credentials/share`,
		PRESTADORES: `${SEMILLAS_URL}/providers`
	}
};
