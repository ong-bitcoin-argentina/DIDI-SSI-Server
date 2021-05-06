const fetch = require('node-fetch');
const Issuer = require('../models/Issuer');

const BlockchainService = require('./BlockchainService');

const Constants = require('../constants/Constants');
const Messages = require('../constants/Messages');

const { putOptionsAuth } = require('../constants/RequestOptions');
const DelegateTransaction = require('../models/DelegateTransaction');

/**
 *  Crea un nuevo issuer
 */
module.exports.addIssuer = async function addIssuer(did, name) {
  // Verificar que el issuer no exista
  const byDIDExist = await Issuer.getByDID(did);
  if (byDIDExist) throw Messages.ISSUER.ERR.DID_EXISTS;

  const { transactionHash, ...rest } = await BlockchainService.addDelegate(did);
  // eslint-disable-next-line no-console
  console.log({ transactionHash, ...rest });

  const expireOn = new Date();
  if (Constants.BLOCKCHAIN.DELEGATE_DURATION) {
    expireOn.setSeconds(expireOn.getSeconds() + Number(Constants.BLOCKCHAIN.DELEGATE_DURATION));
  }

  return Issuer.create({
    name, did, expireOn, blockHash: transactionHash,
  });
};

/**
 *  Permite editar el nombre de un issuer a partir de un did
 */
module.exports.editName = async function editName(did, name) {
  try {
    const issuer = await Issuer.getByDID(did);
    if (!issuer) throw Messages.ISSUER.ERR.DID_NOT_EXISTS;

    return await issuer.editName(name);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
};

/**
 *  Refrescar issuer (nueva fecha de expiración y hash)
 */
module.exports.refresh = async function refresh(did) {
  // Verificar que el issuer no exista o haya sido borrado
  const byDIDExist = await Issuer.getByDID(did);
  if (!byDIDExist || byDIDExist.deleted) throw Messages.ISSUER.ERR.DID_NOT_EXISTS;

  try {
    const { transactionHash, ...rest } = await BlockchainService.addDelegate(did);
    // eslint-disable-next-line no-console
    console.log({ transactionHash, ...rest });

    const expireOn = new Date();
    if (Constants.BLOCKCHAIN.DELEGATE_DURATION) {
      expireOn.setSeconds(expireOn.getSeconds() + Number(Constants.BLOCKCHAIN.DELEGATE_DURATION));
    }

    await byDIDExist.edit({ expireOn, blockHash: transactionHash });

    return { ...byDIDExist, expireOn, blockHash: transactionHash };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
};

/**
 *  Devuelve informacion de un issuer según su did
 */
module.exports.getIssuerByDID = async function getIssuerByDID(did) {
  return Issuer.getByDID(did);
};

/**
 *  Envia respuesta a la url indicada
 */
module.exports.callback = async function callback(url, did, token, data) {
  try {
    const response = await fetch(`${url}/${did}`, putOptionsAuth(token, data));
    const jsonResp = await response.json();

    if (jsonResp.status === 'error') throw jsonResp;

    return jsonResp;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
};

/**
 *  Permite manejar autorización para emitir credenciales de un issuer dada una action
 */
module.exports.createDelegateTransaction = async function createDelegateTransaction({
  did, name, callbackUrl, token, action,
}) {
  try {
    return await DelegateTransaction.create({
      did, name, callbackUrl, token, action,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
};
