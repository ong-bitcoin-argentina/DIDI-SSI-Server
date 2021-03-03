const Issuer = require("../models/Issuer");

const BlockchainService = require("../services/BlockchainService");

const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const fetch = require("node-fetch");
const { putOptionsAuth } = require("../constants/RequestOptions");
const { encrypt } = require("../models/utils/Encryption");
const DelegateTransaction = require("../models/DelegateTransaction");

/**
 *  Crea un nuevo issuer
 */
module.exports.addIssuer = async function (did, name) {
	// Verificar que el issuer no exista
	const byDIDExist = await Issuer.getByDID(did);
	if (byDIDExist) throw Messages.ISSUER.ERR.DID_EXISTS;

	try {
		const { transactionHash, ...rest } = await BlockchainService.addDelegate(did);
		console.log({ transactionHash, ...rest });

		const expireOn = new Date();
		if (Constants.BLOCKCHAIN.DELEGATE_DURATION) {
			expireOn.setSeconds(expireOn.getSeconds() + Number(Constants.BLOCKCHAIN.DELEGATE_DURATION));
		}

		return await Issuer.create({ name, did, expireOn, blockHash: transactionHash });
	} catch (e) {
		throw e;
	}
};

/**
 *  Permite editar el nombre de un issuer a partir de un did
 */
module.exports.editName = async function (did, name) {
	try {
		const issuer = await Issuer.getByDID(did);
		if (!issuer) throw Messages.ISSUER.ERR.DID_NOT_EXISTS;

		return await issuer.editName(name);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};


/**
 *  Refrescar issuer (nueva fecha de expiración y hash)
 */
module.exports.refresh = async function (did) {
	// Verificar que el issuer no exista o haya sido borrado
	const byDIDExist = await Issuer.getByDID(did);
	if (!byDIDExist || byDIDExist.deleted) throw Messages.ISSUER.ERR.DID_NOT_EXISTS;

	try {
		const { transactionHash, ...rest } = await BlockchainService.addDelegate(did);
		console.log({ transactionHash, ...rest });

		const expireOn = new Date();
		if (Constants.BLOCKCHAIN.DELEGATE_DURATION) {
			expireOn.setSeconds(expireOn.getSeconds() + Number(Constants.BLOCKCHAIN.DELEGATE_DURATION));
		}

		await byDIDExist.edit({ expireOn, blockHash: transactionHash });

		return { ...byDIDExist, expireOn, blockHash: transactionHash };
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

/**
 *  Devuelve informacion de un issuer según su did
 */
module.exports.getIssuerByDID = async function (did) {
	return await Issuer.getByDID(did);
};

/**
 *  Envia respuesta a la url indicada
 */
module.exports.callback = async function (url, did, token, data) {
	try {
		const response = await fetch(`${url}/${did}`, putOptionsAuth(token, data));
		const jsonResp = await response.json();

		if (jsonResp.status === "error") throw jsonResp;

		return jsonResp;
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

/**
 *  Permite manejar autorización para emitir credenciales de un issuer dada una action
 */
module.exports.createDelegateTransaction = async function ({ did, name, callbackUrl, token, action }) {
	try {
		return await DelegateTransaction.create({ did, name, callbackUrl, token, action });
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
};
