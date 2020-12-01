const Issuer = require("../models/Issuer");

const BlockchainService = require("../services/BlockchainService");

const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const fetch = require("node-fetch");
const { putOptionsAuth } = require("../constants/RequestOptions");
const { encrypt } = require("../models/utils/Encryption");

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
		throw Messages.ISSUER.ERR.COULDNT_PERSIST;
	}
};

module.exports.getIssuerByDID = async function (did) {
	return await Issuer.getByDID(did);
};

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
