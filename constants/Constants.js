/* eslint-disable eqeqeq */
const assert = require('assert');
// General
const DEBUGG = process.env.DEBUGG_MODE === 'true';
const NO_EMAILS = process.env.NO_EMAILS === 'true';
const NO_SMS = process.env.NO_SMS === 'true';
const ENABLE_INSECURE_ENDPOINTS = process.env.ENABLE_INSECURE_ENDPOINTS === 'true';

const {
  NAME, ENVIRONMENT, RSA_PRIVATE_KEY, HASH_SALT, ADDRESS, PORT, MOURO_URL, VERSION,
  AIDI_VERSION,
} = process.env;

assert.ok(NAME, 'No esta definida la varibale NAME');
assert.ok(ENVIRONMENT, 'No esta definida la varibale ENVIRONMENT');
assert.ok(RSA_PRIVATE_KEY, 'No esta definida la varibale RSA_PRIVATE_KEY');
assert.ok(HASH_SALT, 'No esta definida la varibale HASH_SALT');
assert.ok(ADDRESS, 'No esta definida la varibale ADDRESS');
assert.ok(PORT, 'No esta definida la varibale PORT');
assert.ok(MOURO_URL, 'No esta definida la varibale MOURO_URL');
assert.ok(VERSION, 'No esta definida la varibale VERSION');
assert.ok(AIDI_VERSION, 'No esta definida la variable AIDI_VERSION');

// ethr
const { SERVER_DID, SERVER_PRIVATE_KEY } = process.env;
assert.ok(SERVER_DID, 'No esta definida la varibale SERVER_DID');
assert.ok(SERVER_PRIVATE_KEY, 'No esta definida la varibale SERVER_PRIVATE_KEY');

// MongoDB
const { MONGO_URI } = process.env;
assert.ok(MONGO_URI, 'No esta definida la varibale MONGO_URI');

// MailGun
const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;
assert.ok(MAILGUN_API_KEY, 'No esta definida la varibale MAILGUN_API_KEY');
assert.ok(MAILGUN_DOMAIN, 'No esta definida la varibale MAILGUN_DOMAIN');

// Firebase
const { FIREBASE_URL, FIREBASE_PRIV_KEY_PATH } = process.env;
assert.ok(FIREBASE_URL, 'No esta definida la varibale FIREBASE_URL');
assert.ok(FIREBASE_PRIV_KEY_PATH, 'No esta definida la varibale FIREBASE_PRIV_KEY_PATH');

// Twilio
const { TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
assert.ok(TWILIO_SID, 'No esta definida la varibale TWILIO_SID');
assert.ok(TWILIO_TOKEN, 'No esta definida la varibale TWILIO_TOKEN');
assert.ok(TWILIO_PHONE_NUMBER, 'No esta definida la varibale TWILIO_PHONE_NUMBER');

// Renaper
const {
  SERVER_IP, RENAPER_SCORE_TRESHOULD, RENAPER_API_KEY, RENAPER_API, RENAPER_URL, FINGER_PRINT_DATA,
} = process.env;
assert.ok(SERVER_IP, 'No esta definida la varibale SERVER_IP');
assert.ok(RENAPER_SCORE_TRESHOULD, 'No esta definida la varibale RENAPER_SCORE_TRESHOULD');
assert.ok(RENAPER_API_KEY, 'No esta definida la varibale RENAPER_API_KEY');
assert.ok(RENAPER_API, 'No esta definida la varibale RENAPER_API');
assert.ok(RENAPER_URL, 'No esta definida la varibale RENAPER_URL');
assert.ok(FINGER_PRINT_DATA, 'No esta definida la varibale FINGER_PRINT_DATA');

// Microsoft App Insigths
const DISABLE_TELEMETRY_CLIENT = process.env.DISABLE_TELEMETRY_CLIENT === 'true';

const { APP_INSIGTHS_IKEY } = process.env;
assert.ok(APP_INSIGTHS_IKEY, 'No esta definida la varibale APP_INSIGTHS_IKEY');

// Semillas
const ENABLE_SEMILLAS = process.env.ENABLE_SEMILLAS === 'true';
const { SEMILLAS_USERNAME, SEMILLAS_PASSWORD, SEMILLAS_URL } = process.env;
assert.ok(SEMILLAS_USERNAME, 'No esta definida la varibale SEMILLAS_USERNAME');
assert.ok(SEMILLAS_PASSWORD, 'No esta definida la varibale SEMILLAS_PASSWORD');
assert.ok(SEMILLAS_URL, 'No esta definida la varibale SEMILLAS_URL');

// Blockchain
const { BLOCKCHAIN_URL_RSK, BLOCKCHAIN_URL_LAC, BLOCKCHAIN_URL_BFA } = process.env;

const BLOCKCHAIN_CONTRACT_MAIN = '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b';
const BLOCKCHAIN_CONTRACT_LAC = '0xDF1EbaE3e2318AA57CFaf11E1Dd3531D5A5AdA04';
const BLOCKCHAIN_CONTRACT_BFA = '0x0b2b8e138c38f4ca844dc79d4c004256712de547';

const { INFURA_KEY } = process.env;

const DELEGATE_DURATION = process.env.BLOCK_CHAIN_DELEGATE_DURATION || 1300000;
const GAS_INCREMENT = process.env.GAS_INCREMENT || '1.1';

assert.ok(BLOCKCHAIN_URL_RSK, 'No esta definida la varibale BLOCKCHAIN_URL_RSK');
assert.ok(BLOCKCHAIN_URL_LAC, 'No esta definida la varibale BLOCKCHAIN_URL_LAC');
assert.ok(BLOCKCHAIN_URL_BFA, 'No esta definida la varibale BLOCKCHAIN_URL_BFA');
assert.ok(INFURA_KEY, 'No esta definida la varibale INFURA_KEY');

const PROVIDER_CONFIG = {
  networks: [
    {
      name: 'mainnet',
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'ropsten',
      rpcUrl: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'rinkeby',
      rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'goerli',
      rpcUrl: `https://goerli.infura.io/v3/${INFURA_KEY}`,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'kovan',
      rpcUrl: `https://kovan.infura.io/v3/${INFURA_KEY}`,
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
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
  ],
};

module.exports = {
  NAME,
  APP_INSIGTHS_IKEY,
  ENVIRONMENT,
  DISABLE_TELEMETRY_CLIENT,
  DEBUGG,
  MONGO_URL: MONGO_URI,
  ADDRESS,
  PORT,
  VERSION,
  AIDI_VERSION,

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

  ENABLE_SEMILLAS,
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
