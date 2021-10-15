// TODO: fix
// eslint-disable-next-line import/no-extraneous-dependencies
const BlockchainService = require('./BlockchainService');
const Messages = require('../constants/Messages');
const Constants = require('../constants/Constants');

const {
  missingToken, missingJwt,
} = require('../constants/serviceErrors');

const {
  EXPIRED, INVALID_CODE, EXPIRED_CODE, INVALID,
} = Messages.TOKEN;

const serverDid = `did:ethr:${Constants.SERVER_DID}`;

const errorMessages = {
  TokenExpiredError: EXPIRED_CODE(),
};

/**
 *  Valida el token y devuelve el userId
 */
const getTokenData = async (token) => {
  if (!token) throw missingToken;
  try {
    const decoded = await BlockchainService.decodeJWT(token);
    if (!decoded) {
      throw INVALID();
    }

    return decoded;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);

    if (err.name === 'TokenExpiredError') {
      throw EXPIRED();
    }
    if (err.name === 'JsonWebTokenError') {
      throw INVALID();
    }
    throw new Error({ name: err.name, message: err.message });
  }
};

/**
 *  Devuelve un payload a partir del jwt
 */
const getPayload = async (jwt) => {
  if (!jwt) throw missingJwt;
  const { payload } = await BlockchainService.decodeJWT(jwt);
  return payload;
};

/**
 *  Verificar jwt
 */
const verifyToken = async (jwt, isUser = false) => {
  if (!jwt) throw missingJwt;
  try {
    const response = await BlockchainService.verifyJWT(jwt, serverDid);
    return response;
  } catch (error) {
    const message = errorMessages[error.name] || INVALID_CODE(isUser);
    throw message;
  }
};

module.exports = {
  getPayload,
  getTokenData,
  verifyToken,
};
