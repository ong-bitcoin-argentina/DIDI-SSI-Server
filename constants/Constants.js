const DEBUGG = process.env.DEBUGG || true;
const MONGO_DIR = process.env.MONGO_DIR || "127.0.0.1"; // "mongo" on docker
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const MONGO_USER = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB || "didi";
const PORT = process.env.PORT || 3000;

const URL = MONGO_DIR + ":" + MONGO_PORT + "/" + MONGO_DB;
const MONGO_URL =
	MONGO_USER && MONGO_PASSWORD ? "mongodb://" + MONGO_USER + ":" + MONGO_PASSWORD + "@" + URL : "mongodb://" + URL;

module.exports = {
	API_VERSION: "1.0",
	DEBUGG: DEBUGG,
	MONGO_URL: MONGO_URL,
	PORT: PORT,

	VALIDATION_TYPES: {
		IS_MOBILE_PHONE: "isMobilePhone",
		IS_EMAIL: "isEmail",
		IS_BASE_64: "isBase64",
		IS_STRING: "isString",
		IS_DATE_TIME: "isDateTime",
		IS_PASSWORD: "isPassword"
	},

	MAILGUN_API_KEY: "***REMOVED***",
	MAILGUN_DOMAIN: "***REMOVED***",

	TWILIO_SID: "***REMOVED***",
	TWILIO_TOKEN: "***REMOVED***",
	TWILIO_PHONE_NUMBER: "***REMOVED***",
	PHONE_REGION: "+54911",

	RECOVERY_CODE_LENGTH: 6,
	HOURS_BEFORE_CODE_EXPIRES: 1,

	PASSWORD_MIN_LENGTH: 6,
	COMMON_PASSWORDS: ["123456", "contraseña", "password"]
};
