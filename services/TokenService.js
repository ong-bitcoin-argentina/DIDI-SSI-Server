const { decodeJWT, verifyJWT } = require('did-jwt');
// TODO: fix
// eslint-disable-next-line import/no-extraneous-dependencies
const { Resolver } = require('did-resolver');
const { getResolver } = require('ethr-did-resolver');
const Messages = require('../constants/Messages');
const { SERVER_DID } = require('../constants/Constants');
const Constants = require('../constants/Constants');

const {
  missingToken, missingJwt,
} = require('../constants/serviceErrors');

const {
  EXPIRED, INVALID_CODE, EXPIRED_CODE, INVALID,
} = Messages.TOKEN;

const resolver = new Resolver(getResolver(Constants.BLOCKCHAIN.PROVIDER_CONFIG));

const serverDid = `did:ethr:${SERVER_DID}`;

const errorMessages = {
  TokenExpiredError: EXPIRED_CODE(),
};

/**
 *  Valida el token y devuelve el userId
 */
const getTokenData = async (token) => {
  if (!token) throw missingToken;
  try {
    const decoded = await decodeJWT(token);
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
const getPayload = (jwt) => {
  if (!jwt) throw missingJwt;
  const { payload } = decodeJWT(jwt);
  return payload;
};

/**
 *  Verificar jwt
 */
const verifyToken = async (jwt, isUser = false) => {
  if (!jwt) throw missingJwt;
  const options = {
    resolver,
    audience: serverDid,
  };
  try {
    return await verifyJWT(jwt, options);
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
