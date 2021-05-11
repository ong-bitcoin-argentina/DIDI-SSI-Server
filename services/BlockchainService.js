const { BlockchainManager } = require('@proyecto-didi/didi-blockchain-manager');
const Constants = require('../constants/Constants');
const IssuerService = require('./IssuerService');

const Messages = require('../constants/Messages');
const { SERVER_PRIVATE_KEY, SERVER_DID } = require('../constants/Constants');

const {
  missingOtherDID, missingIssuerDid,
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
    return await issuer.delete();
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
