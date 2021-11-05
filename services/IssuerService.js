/* eslint-disable no-console */
const fetch = require('node-fetch');

const Issuer = require('../models/Issuer');
const DelegateTransaction = require('../models/DelegateTransaction');

const BlockchainService = require('./BlockchainService');

const Constants = require('../constants/Constants');
const Messages = require('../constants/Messages');
const { patchOptionsAuth } = require('../constants/RequestOptions');

const {
  missingDid,
  missingName,
  missingUrl,
  missingToken,
  missingData,
  missingCallback,
  missingAction,
  missingDescription,
} = require('../constants/serviceErrors');

/**
 *  Crea un nuevo issuer
 */
module.exports.addIssuer = async function addIssuer(did, name, description, imageUrl) {
  if (!did) throw missingDid;
  if (!name) throw missingName;
  if (!description) throw missingDescription;

  // Verificar que el issuer no exista
  const issuer = await Issuer.getByDID(did);

  // Realizar delegacion/nes en la blockchain
  const transactions = await BlockchainService.addDelegate(did);

  // Extraer delegaciones exitosas
  const delegationHashes = transactions.filter(({ status }) => status === 'fulfilled')
    .map(({ network, value }) => ({ network, transactionHash: value.transactionHash }));

  if (Constants.DEBUGG) console.log(delegationHashes);

  if (delegationHashes.length === 0) throw Messages.ISSUER.ERR.COULDNT_PERSIST;

  // Asignar fecha de expiracion
  const expireOn = new Date();
  if (Constants.BLOCKCHAIN.DELEGATE_DURATION) {
    expireOn.setSeconds(expireOn.getSeconds() + Number(Constants.BLOCKCHAIN.DELEGATE_DURATION));
  }

  if (issuer) {
    issuer.delegationHashes.push({
      $each: delegationHashes,
      $position: 0,
    });
    const save = await issuer.save();
    return save;
  }

  const didWithoutNetwork = await BlockchainService.removeBlockchainFromDid(did);

  return Issuer.create({
    name, did: didWithoutNetwork, expireOn, delegationHashes, description, imageUrl,
  });
};

/**
 *  Permite editar el nombre de un issuer a partir de un did
 */
module.exports.editData = async function editData(did, name, description, imageUrl) {
  if (!did) throw missingDid;
  try {
    let issuer = await Issuer.getByDID(did);
    if (!issuer) throw Messages.ISSUER.ERR.DID_NOT_EXISTS;

    issuer = await issuer.edit({ name, description, imageUrl });

    return issuer;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 *  Refrescar issuer (nueva fecha de expiración y hash)
 */
module.exports.refresh = async function refresh(did) {
  if (!did) throw missingDid;
  // Verificar que el issuer no exista o haya sido borrado
  const byDIDExist = await Issuer.getByDID(did);
  if (!byDIDExist || byDIDExist.deleted) throw Messages.ISSUER.ERR.DID_NOT_EXISTS;

  try {
    const { transactionHash, ...rest } = await BlockchainService.addDelegate(did);
    if (Constants.DEBUGG) console.log({ transactionHash, ...rest });

    const expireOn = new Date();
    if (Constants.BLOCKCHAIN.DELEGATE_DURATION) {
      expireOn.setSeconds(expireOn.getSeconds() + Number(Constants.BLOCKCHAIN.DELEGATE_DURATION));
    }

    await byDIDExist.edit({ expireOn, blockHash: transactionHash });

    return { ...byDIDExist, expireOn, blockHash: transactionHash };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 *  Devuelve informacion de un issuer según su did
 */
module.exports.getIssuerByDID = async function getIssuerByDID(did) {
  if (!did) throw missingDid;
  try {
    return await Issuer.getByDID(did);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 *  Devuelve informacion de todos los issuer delegados
 */
module.exports.getAll = async function getAll(limit, page) {
  return Issuer.getAll(limit, page);
};

/**
 *  Envia respuesta a la url indicada
 */
module.exports.callback = async function callback(url, did, token, data) {
  if (!did) throw missingDid;
  if (!url) throw missingUrl;
  if (!token) throw missingToken;
  if (!data) throw missingData;
  try {
    const response = await fetch(`${url}/${did}`, patchOptionsAuth(token, data));
    const jsonResp = await response.json();

    if (jsonResp.status === 'error') throw jsonResp;

    return jsonResp;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 *  Permite manejar autorización para emitir credenciales de un issuer dada una action
 */
module.exports.createDelegateTransaction = async function createDelegateTransaction({
  did, name, callbackUrl, token, action, description, imageUrl,
}) {
  if (!did) throw missingDid;
  if (!callbackUrl) throw missingCallback;
  if (!token) throw missingToken;
  if (!action) throw missingAction;
  try {
    return await DelegateTransaction.create({
      did, name, callbackUrl, token, action, description, imageUrl,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
