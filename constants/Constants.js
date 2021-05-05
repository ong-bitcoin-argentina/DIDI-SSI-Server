if (process.env.MONGO_DIR == null || process.env.MONGO_DIR == '') throw new Error('No esta definida la varibale MONGO_DIR');
if (process.env.MONGO_PORT == null || process.env.MONGO_PORT == '') throw new Error('No esta definida la varibale MONGO_PORT');
if (process.env.MONGO_DB == null || process.env.MONGO_DB == '') throw new Error('No esta definida la varibale MONGO_DB');
if (process.env.ADDRESS == null || process.env.ADDRESS == '') throw new Error('No esta definida la varibale ADDRESS');
if (process.env.PORT == null || process.env.PORT == '') throw new Error('No esta definida la varibale PORT');
if (process.env.SERVER_DID == null || process.env.SERVER_DID == '') throw new Error('No esta definida la varibale SERVER_DID');
if (process.env.MOURO_URL == null || process.env.MOURO_URL == '') throw new Error('No esta definida la varibale MOURO_URL');
if (process.env.MAILGUN_API_KEY == null || process.env.MAILGUN_API_KEY == '') throw new Error('No esta definida la varibale MAILGUN_API_KEY');
if (process.env.MAILGUN_DOMAIN == null || process.env.MAILGUN_DOMAIN == '') throw new Error('No esta definida la varibale MAILGUN_DOMAIN');
if (process.env.TWILIO_SID == null || process.env.TWILIO_SID == '') throw new Error('No esta definida la varibale TWILIO_SID');
if (process.env.TWILIO_TOKEN == null || process.env.TWILIO_TOKEN == '') throw new Error('No esta definida la varibale TWILIO_TOKEN');
if (process.env.TWILIO_PHONE_NUMBER == null || process.env.TWILIO_PHONE_NUMBER == '') throw new Error('No esta definida la varibale TWILIO_PHONE_NUMBER');
if (process.env.SERVER_IP == null || process.env.SERVER_IP == '') throw new Error('No esta definida la varibale SERVER_IP');
if (process.env.RENAPER_SCORE_TRESHOULD == null || process.env.RENAPER_SCORE_TRESHOULD == '') throw new Error('No esta definida la varibale RENAPER_SCORE_TRESHOULD');
if (process.env.RENAPER_API_KEY == null || process.env.RENAPER_API_KEY == '') throw new Error('No esta definida la varibale RENAPER_API_KEY');
if (process.env.RENAPER_API == null || process.env.RENAPER_API == '') throw new Error('No esta definida la varibale RENAPER_API');
if (process.env.RENAPER_URL == null || process.env.RENAPER_URL == '') throw new Error('No esta definida la varibale RENAPER_URL');
if (process.env.FINGER_PRINT_DATA == null || process.env.FINGER_PRINT_DATA == '') throw new Error('No esta definida la varibale FINGER_PRINT_DATA');
if (process.env.RSA_PRIVATE_KEY == null || process.env.RSA_PRIVATE_KEY == '') throw new Error('No esta definida la varibale RSA_PRIVATE_KEY');
if (process.env.HASH_SALT == null || process.env.HASH_SALT == '') throw new Error('No esta definida la varibale HASH_SALT');
if (process.env.FIREBASE_URL == null || process.env.FIREBASE_URL == '') throw new Error('No esta definida la varibale FIREBASE_URL');
if (process.env.FIREBASE_PRIV_KEY_PATH == null || process.env.FIREBASE_PRIV_KEY_PATH == '') throw new Error('No esta definida la varibale FIREBASE_PRIV_KEY_PATH');
if (process.env.NAME == null || process.env.NAME == '') throw new Error('No esta definida la varibale NAME');
if (process.env.ENVIRONMENT == null || process.env.ENVIRONMENT == '') throw new Error('No esta definida la varibale ENVIRONMENT');
if (process.env.BLOCKCHAIN_URL_MAIN == null || process.env.BLOCKCHAIN_URL_MAIN == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_MAIN');
if (process.env.BLOCKCHAIN_URL_RSK == null || process.env.BLOCKCHAIN_URL_RSK == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_RSK');
if (process.env.BLOCKCHAIN_URL_LAC == null || process.env.BLOCKCHAIN_URL_LAC == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_LAC');
if (process.env.BLOCKCHAIN_URL_BFA == null || process.env.BLOCKCHAIN_URL_BFA == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_BFA');
if (process.env.BLOCKCHAIN_CONTRACT_MAIN == null || process.env.BLOCKCHAIN_CONTRACT_MAIN == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_MAIN');
if (process.env.BLOCKCHAIN_CONTRACT_RSK == null || process.env.BLOCKCHAIN_CONTRACT_RSK == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_RSK');
if (process.env.BLOCKCHAIN_CONTRACT_LAC == null || process.env.BLOCKCHAIN_CONTRACT_LAC == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_LAC');
if (process.env.BLOCKCHAIN_CONTRACT_BFA == null || process.env.BLOCKCHAIN_CONTRACT_BFA == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_BFA');

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

const DELEGATE_DURATION = process.env.BLOCK_CHAIN_DELEGATE_DURATION || 1300000;
const GAS_INCREMENT = process.env.GAS_INCREMENT || "1.1";

const NAME = process.env.NAME;
const APP_INSIGTHS_IKEY = process.env.APP_INSIGTHS_IKEY;
const ENVIRONMENT = process.env.ENVIRONMENT;
const DISABLE_TELEMETRY_CLIENT = process.env.DISABLE_TELEMETRY_CLIENT;
// ======================================================================================================

const BLOCKCHAIN_URL_MAIN = process.env.BLOCKCHAIN_URL_MAIN; // RSK
const BLOCKCHAIN_URL_RSK = process.env.BLOCKCHAIN_URL_RSK; // RSK
const BLOCKCHAIN_URL_LAC = process.env.BLOCKCHAIN_URL_LAC; // Lacchain
const BLOCKCHAIN_URL_BFA = process.env.BLOCKCHAIN_URL_BFA; // BFA testnet

// uPort SC ON
const BLOCKCHAIN_CONTRACT_MAIN = process.env.BLOCKCHAIN_CONTRACT_MAIN; // RSK
const BLOCKCHAIN_CONTRACT_RSK = process.env.BLOCKCHAIN_CONTRACT_RSK; // RSK
const BLOCKCHAIN_CONTRACT_LAC = process.env.BLOCKCHAIN_CONTRACT_LAC; // Lacchain
const BLOCKCHAIN_CONTRACT_BFA = process.env.BLOCKCHAIN_CONTRACT_BFA; // BFA

// Provider
// MAINNET SHOULD BE THE FIRST NETWORK
// DID ROUTE EXAMPLE PREFIX:
// MAINNET ==> did:ethr:
// RSK ==> did:ethr:rsk:
// LACCHAIN ==> did:ethr:lacchain:
const PROVIDER_CONFIG = {
	networks: [
		{
			name: "mainnet",
			rpcUrl: BLOCKCHAIN_URL_MAIN,
			registry: BLOCKCHAIN_CONTRACT_MAIN
		},
		{
			name: "lacchain",
			rpcUrl: BLOCKCHAIN_URL_LAC,
			registry: BLOCKCHAIN_CONTRACT_LAC
		},
		{
			name: "bfa",
			rpcUrl: BLOCKCHAIN_URL_BFA,
			registry: BLOCKCHAIN_CONTRACT_BFA
		},
		{
			name: "rsk",
			rpcUrl: BLOCKCHAIN_URL_RSK,
			registry: BLOCKCHAIN_CONTRACT_RSK
		}
	]
};

const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY;
const HASH_SALT = process.env.HASH_SALT;

const FIREBASE_URL = process.env.FIREBASE_URL;
const FIREBASE_PRIV_KEY_PATH = process.env.FIREBASE_PRIV_KEY_PATH;

const SEMILLAS_URL = process.env.SEMILLAS_URL;

module.exports = {
	NAME,
	APP_INSIGTHS_IKEY,
	ENVIRONMENT,
	DISABLE_TELEMETRY_CLIENT,
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
		PROVIDER_CONFIG: PROVIDER_CONFIG,
		GAS_INCREMENT: GAS_INCREMENT,
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
	},

	MAX_MB: 3,
	STATUS: {
		DONE: "Creado",
		ERROR: "Error",
		ERROR_RENEW: "Error al Renovar",
		REVOKED: "Revocado"
	},

	DELEGATE_ACTIONS: {
		CREATE: "CREATE",
		REVOKE: "REVOKE",
		REFRESH: "REFRESH"
	},

	EXPIRE_IN_MINUTES: 60,

	JOBS: {
		CANCEL_CALLBACK: 'DEFINITIVE FAIL',
	}

};
