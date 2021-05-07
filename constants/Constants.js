/* eslint-disable eqeqeq */
require('dotenv').config();

// General
require('dotenv').config();

const DEBUGG = process.env.DEBUGG_MODE === 'true';
const NO_EMAILS = process.env.NO_EMAILS === 'true';
const NO_SMS = process.env.NO_SMS === 'true';
const ENABLE_INSECURE_ENDPOINTS = process.env.ENABLE_INSECURE_ENDPOINTS === 'true';

const {
  NAME, ENVIRONMENT, RSA_PRIVATE_KEY, HASH_SALT, ADDRESS, PORT, MOURO_URL,
} = process.env;

if (NAME == null || NAME == '') throw new Error('No esta definida la varibale NAME');
if (ENVIRONMENT == null || ENVIRONMENT == '') throw new Error('No esta definida la varibale ENVIRONMENT');
if (RSA_PRIVATE_KEY == null || RSA_PRIVATE_KEY == '') throw new Error('No esta definida la varibale RSA_PRIVATE_KEY');
if (HASH_SALT == null || HASH_SALT == '') throw new Error('No esta definida la varibale HASH_SALT');
if (ADDRESS == null || ADDRESS == '') throw new Error('No esta definida la varibale ADDRESS');
if (PORT == null || PORT == '') throw new Error('No esta definida la varibale PORT');
if (MOURO_URL == null || MOURO_URL == '') throw new Error('No esta definida la varibale MOURO_URL');

// ethr
const { SERVER_DID, SERVER_PRIVATE_KEY } = process.env;
if (SERVER_DID == null || SERVER_DID == '') throw new Error('No esta definida la varibale SERVER_DID');
if (SERVER_PRIVATE_KEY == null || SERVER_PRIVATE_KEY == '') throw new Error('No esta definida la varibale SERVER_PRIVATE_KEY');

// MongoDB
const MONGO_USER = process.env.MONGO_USERNAME;
const {
  MONGO_DIR, MONGO_PORT, MONGO_PASSWORD, MONGO_DB,
} = process.env;

if (MONGO_USER == null || MONGO_USER == '') throw new Error('No esta definida la varibale MONGO_USER');
if (MONGO_PASSWORD == null || MONGO_PASSWORD == '') throw new Error('No esta definida la varibale MONGO_PORT');
if (MONGO_DIR == null || MONGO_DIR == '') throw new Error('No esta definida la varibale MONGO_DIR');
if (MONGO_PORT == null || MONGO_PORT == '') throw new Error('No esta definida la varibale MONGO_PORT');
if (MONGO_DB == null || MONGO_DB == '') throw new Error('No esta definida la varibale MONGO_DB');

const URL = `${MONGO_DIR}:${MONGO_PORT}/${MONGO_DB}`;
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${URL}`;

// MailGun
const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;
if (MAILGUN_DOMAIN == null || MAILGUN_DOMAIN == '') throw new Error('No esta definida la varibale MAILGUN_DOMAIN');
if (MAILGUN_API_KEY == null || MAILGUN_API_KEY == '') throw new Error('No esta definida la varibale MAILGUN_API_KEY');

// Firebase
const { FIREBASE_URL, FIREBASE_PRIV_KEY_PATH } = process.env;
if (FIREBASE_URL == null || FIREBASE_URL == '') throw new Error('No esta definida la varibale FIREBASE_URL');
if (FIREBASE_PRIV_KEY_PATH == null || FIREBASE_PRIV_KEY_PATH == '') throw new Error('No esta definida la varibale FIREBASE_PRIV_KEY_PATH');

// Twilio
const { TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
if (TWILIO_SID == null || TWILIO_SID == '') throw new Error('No esta definida la varibale TWILIO_SID');
if (TWILIO_TOKEN == null || TWILIO_TOKEN == '') throw new Error('No esta definida la varibale TWILIO_TOKEN');
if (TWILIO_PHONE_NUMBER == null || TWILIO_PHONE_NUMBER == '') throw new Error('No esta definida la varibale TWILIO_PHONE_NUMBER');

// Renaper
const {
  SERVER_IP, RENAPER_SCORE_TRESHOULD, RENAPER_API_KEY, RENAPER_API, RENAPER_URL, FINGER_PRINT_DATA,
} = process.env;

if (SERVER_IP == null || SERVER_IP == '') throw new Error('No esta definida la varibale SERVER_IP');
if (RENAPER_SCORE_TRESHOULD == null || RENAPER_SCORE_TRESHOULD == '') throw new Error('No esta definida la varibale RENAPER_SCORE_TRESHOULD');
if (RENAPER_API_KEY == null || RENAPER_API_KEY == '') throw new Error('No esta definida la varibale RENAPER_API_KEY');
if (RENAPER_API == null || RENAPER_API == '') throw new Error('No esta definida la varibale RENAPER_API');
if (RENAPER_URL == null || RENAPER_URL == '') throw new Error('No esta definida la varibale RENAPER_URL');
if (FINGER_PRINT_DATA == null || FINGER_PRINT_DATA == '') throw new Error('No esta definida la varibale FINGER_PRINT_DATA');

// Microsoft App Insigths
const DISABLE_TELEMETRY_CLIENT = process.env.DISABLE_TELEMETRY_CLIENT === 'true';

const { APP_INSIGTHS_IKEY } = process.env;
if (APP_INSIGTHS_IKEY == null || APP_INSIGTHS_IKEY == '') throw new Error('No esta definida la varibale APP_INSIGTHS_IKEY');

// Semillas
const { SEMILLAS_USERNAME, SEMILLAS_PASSWORD, SEMILLAS_URL } = process.env;
if (SEMILLAS_USERNAME == null || SEMILLAS_USERNAME == '') throw new Error('No esta definida la varibale SEMILLAS_USERNAME');
if (SEMILLAS_PASSWORD == null || SEMILLAS_PASSWORD == '') throw new Error('No esta definida la varibale SEMILLAS_PASSWORD');
if (SEMILLAS_URL == null || SEMILLAS_URL == '') throw new Error('No esta definida la varibale SEMILLAS_URL');

// Blockchain
const {
  BLOCKCHAIN_CONTRACT_MAIN, BLOCKCHAIN_CONTRACT_RSK, BLOCKCHAIN_CONTRACT_LAC,
  BLOCKCHAIN_CONTRACT_BFA, BLOCKCHAIN_URL_MAIN, BLOCKCHAIN_URL_RSK,
  BLOCKCHAIN_URL_LAC, BLOCKCHAIN_URL_BFA,
} = process.env;

const DELEGATE_DURATION = process.env.BLOCK_CHAIN_DELEGATE_DURATION || 1300000;
const GAS_INCREMENT = process.env.GAS_INCREMENT || '1.1';

if (BLOCKCHAIN_URL_MAIN == null || BLOCKCHAIN_URL_MAIN == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_MAIN');
if (BLOCKCHAIN_URL_RSK == null || BLOCKCHAIN_URL_RSK == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_RSK');
if (BLOCKCHAIN_URL_LAC == null || BLOCKCHAIN_URL_LAC == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_LAC');
if (BLOCKCHAIN_URL_BFA == null || BLOCKCHAIN_URL_BFA == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_BFA');
if (BLOCKCHAIN_CONTRACT_MAIN == null || BLOCKCHAIN_CONTRACT_MAIN == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_MAIN');
if (BLOCKCHAIN_CONTRACT_RSK == null || BLOCKCHAIN_CONTRACT_RSK == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_RSK');
if (BLOCKCHAIN_CONTRACT_LAC == null || BLOCKCHAIN_CONTRACT_LAC == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_LAC');
if (BLOCKCHAIN_CONTRACT_BFA == null || BLOCKCHAIN_CONTRACT_BFA == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_BFA');

// Provider
// MAINNET SHOULD BE THE FIRST NETWORK
// DID ROUTE EXAMPLE PREFIX:
// MAINNET ==> did:ethr:
// RSK ==> did:ethr:rsk:
// LACCHAIN ==> did:ethr:lacchain:
const PROVIDER_CONFIG = {
  networks: [
    {
      name: 'mainnet',
      rpcUrl: BLOCKCHAIN_URL_MAIN,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'lacchain',
      rpcUrl: BLOCKCHAIN_URL_LAC,
      registry: BLOCKCHAIN_CONTRACT_LAC,
    },
    {
      name: 'bfa',
      rpcUrl: BLOCKCHAIN_URL_BFA,
      registry: BLOCKCHAIN_CONTRACT_BFA,
    },
    {
      name: 'rsk',
      rpcUrl: BLOCKCHAIN_URL_RSK,
      registry: BLOCKCHAIN_CONTRACT_RSK,
    },
  ],
};

module.exports = {
  NAME,
  APP_INSIGTHS_IKEY,
  ENVIRONMENT,
  DISABLE_TELEMETRY_CLIENT,
  API_VERSION: '1.0',
  DEBUGG,
  MONGO_URL,
  ADDRESS,
  PORT,

  RSA_PRIVATE_KEY,
  HASH_SALT,

  RENAPER_API_KEY,
  RENAPER_API,
  RENAPER_SCORE_TRESHOULD,

  FINGER_PRINT_DATA,
  RENAPER_APP_VERS: '1.0.0',
  RENAPER_ANALYZE_ANOMALIES: false,
  RENAPER_ANALYZE_OCR: false,
  SERVER_IP,

  RENAPER_URLS: {
    SCAN_BAR_CODE: `${RENAPER_URL}/scanBarcode`,
    NEW_OPERATION: `${RENAPER_URL}/newOperation`,
    ADD_FRONT: `${RENAPER_URL}/addFront`,
    ADD_BACK: `${RENAPER_URL}/addBack`,
    ADD_SELFIE: `${RENAPER_URL}/register`,
    ADD_BAR_CODE: `${RENAPER_URL}/addBarcode`,
    END_OPERATION: `${RENAPER_URL}/endOperation`,
  },

  MOURO_URL,
  SERVER_DID,
  SERVER_PRIVATE_KEY,
  CREDENTIALS: {
    TYPES: {
      VERIFIABLE: 'VerifiableCredential',
    },
    CONTEXT: 'https://www.w3.org/2018/credentials/v1',
  },

  VALIDATION_TYPES: {
    IS_AUTH_TOKEN: 'IsAuthToken',
    IS_MOBILE_PHONE: 'isMobilePhone',
    IS_EMAIL: 'isEmail',
    IS_STRING: 'isString',
    IS_DATE_TIME: 'isDateTime',
    IS_BOOLEAN: 'isBoolean',
    IS_PASSWORD: 'isPassword',
    IS_BASE_64_IMAGE: 'isBase64Image',
    IS_FINGER_PRINT: 'isFingerPrint',
    IS_NUMBER: 'isNumber',
    IS_DNI: 'isDni',
    IS_IP: 'isIp',
  },

  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,

  TWILIO_SID,
  TWILIO_TOKEN,
  TWILIO_PHONE_NUMBER,

  RECOVERY_CODE_LENGTH: 6,
  HOURS_BEFORE_CODE_EXPIRES: 1,

  SALT_WORK_FACTOR: 16,
  PASSWORD_MIN_LENGTH: 6,
  COMMON_PASSWORDS: ['123456', 'contraseña', 'password'],

  AUTHENTICATION_REQUEST: {
    IN_PROGRESS: 'In Progress',
    SUCCESSFUL: 'Successful',
    FALIED: 'Falied',
  },

  CERTIFICATE_NAMES: {
    EMAIL: 'EMAIL',
    TEL: 'TEL',
    USER_INFO: 'USER_INFO',
    USER_ADDRESS: 'USER_ADDRESS',
    GENERIC: 'GENERIC',
  },

  CERTIFICATE_STATUS: {
    UNVERIFIED: 'UNVERIFIED',
    VERIFIED: 'VERIFIED',
    REVOKED: 'REVOKED',
  },

  BLOCKCHAIN: {
    PROVIDER_CONFIG,
    GAS_INCREMENT,
    DELEGATE_DURATION,
  },

  FIREBASE_URL,
  FIREBASE_PRIV_KEY_PATH,

  NO_EMAILS,
  NO_SMS,

  SEMILLAS_LOGIN: {
    username: SEMILLAS_USERNAME,
    password: SEMILLAS_PASSWORD,
  },
  SEMILLAS_URL,
  SEMILLAS_URLS: {
    LOGIN: `${SEMILLAS_URL}/auth/login`,
    CREDENTIALS_DIDI: `${SEMILLAS_URL}/credentials/didi`,
    VALIDATE_DNI: `${SEMILLAS_URL}/identityValidationRequests`,
    SHARE_DATA: `${SEMILLAS_URL}/credentials/share`,
    PRESTADORES: `${SEMILLAS_URL}/providers`,
  },

  MAX_MB: 3,
  STATUS: {
    DONE: 'Creado',
    ERROR: 'Error',
    ERROR_RENEW: 'Error al Renovar',
    REVOKED: 'Revocado',
  },

  DELEGATE_ACTIONS: {
    CREATE: 'CREATE',
    REVOKE: 'REVOKE',
    REFRESH: 'REFRESH',
  },

  EXPIRE_IN_MINUTES: 60,

  JOBS: {
    CANCEL_CALLBACK: 'DEFINITIVE FAIL',
  },
  ENABLE_INSECURE_ENDPOINTS,
};
