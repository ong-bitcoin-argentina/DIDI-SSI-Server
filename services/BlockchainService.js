const { BlockchainManager } = require('@proyecto-didi/didi-blockchain-manager');
const Constants = require('../constants/Constants');
const IssuerService = require('./IssuerService');
const Messages = require('../constants/Messages');
const { SERVER_PRIVATE_KEY, SERVER_DID } = require('../constants/Constants');

const {
  missingOtherDID,
  missingIssuerDid,
  missingJwt,
  missingPrivateKey,
  missingPayload,
  missingDid,
} = require('../constants/serviceErrors');

/**
 *  Instanciar Blockchain Manager
 */
const config = {
  gasPrice: 10000,
  providerConfig: Constants.BLOCKCHAIN.PROVIDER_CONFIG, // para multiblockchain
};
const blockchainManager = new BlockchainManager(config, Constants.BLOCKCHAIN.GAS_INCREMENT);

/**
 *  Realiza una delegación de "DIDI Server" a "issuer"
 */
module.exports.addDelegate = async function addDelegate(issuerDID) {
  if (!issuerDID) throw missingIssuerDid;
  try {
    const credentials = {
      did: Constants.SERVER_DID,
      privateKey: Constants.SERVER_PRIVATE_KEY,
    };
    return blockchainManager
      .addDelegate(credentials, issuerDID, Constants.BLOCKCHAIN.DELEGATE_DURATION);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err.toString();
  }
};

/**
 *  En caso de existir, anula la delegación de "userDID" a "otherDID"
 */
module.exports.revokeDelegate = async function revokeDelegate(otherDID) {
  if (!otherDID) throw missingOtherDID;
  try {
    const issuer = await IssuerService.getIssuerByDID(otherDID);

    if (!issuer) Promise.reject(Messages.ISSUER.ERR.NOT_FOUND);
    await blockchainManager.revokeDelegate(
      { did: SERVER_DID, privateKey: SERVER_PRIVATE_KEY },
      otherDID,
    );
    return issuer.delete();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err.toString();
  }
};

/**
 *  Retorna true si "userDID" realizó una delegación de DID a "otherDID"
 */
module.exports.validDelegate = async function validDelegate(issuerDID) {
  if (!issuerDID) throw missingIssuerDid;
  try {
    return await blockchainManager.validateDelegate(Constants.SERVER_DID, issuerDID);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw Messages.DELEGATE.ERR.GET_DELEGATE;
  }
};

/**
 * Cenera un certificado asociando la informacion recibida
 */
module.exports.createVerifiableCredential = function createCertificate(
  subjectDid, subjectPayload, expirationDate, issuerDid, issuerPkey,
) {
  if (!issuerDid) throw missingIssuerDid;
  if (!issuerPkey) throw missingPrivateKey;
  if (!subjectPayload) throw missingPayload;
  if (!subjectDid) throw missingDid;
  try {
    return blockchainManager.createCertificate(
      subjectDid, subjectPayload, expirationDate, issuerDid, issuerPkey,
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw Messages.CERTIFICATE.ERR.CREATE;
  }
};

/**
 * Crea un jwt a partir del payload con la informacion a codificar
 */
module.exports.createJWT = function createJWT(
  issuerDID, privateKey, payload, expiration, audienceDID,
) {
  if (!issuerDID) throw missingIssuerDid;
  if (!privateKey) throw missingPrivateKey;
  if (!payload) throw missingPayload;
  return blockchainManager.createJWT(issuerDID, privateKey, payload, expiration, audienceDID);
};

/**
 * Decodifica un jwt y devuelve su contenido
 */
module.exports.decodeJWT = function decodeJWT(jwt) {
  if (!jwt) throw missingJwt;
  return blockchainManager.decodeJWT(jwt);
};

/**
 * Verifica una credencial
 */
module.exports.verifyCertificate = function verifyCertificate(jwt) {
  if (!jwt) throw missingJwt;
  try {
    return blockchainManager.verifyCertificate(jwt);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw Messages.CERTIFICATE.ERR.VERIFY;
  }
};

/**
 * Verifica un jwt
 */
module.exports.verifyJWT = async function verifyJWT(jwt, audienceDID) {
  if (!jwt) throw missingJwt;
  return blockchainManager.verifyJWT(jwt, audienceDID);
};

/**
 * Crea una firma valida a partir de la clave privada
 */
module.exports.getSigner = function getSigner(privateKey) {
  if (!privateKey) throw missingPrivateKey;
  return blockchainManager.getSigner(privateKey);
};

/**
 * Devuelve la direccion de un did
 */
module.exports.getDidAddress = function getDidAddress(did) {
  if (!did) throw missingDid;
  const cleanDid = did.split(':');
  return cleanDid[cleanDid.length - 1];
};
