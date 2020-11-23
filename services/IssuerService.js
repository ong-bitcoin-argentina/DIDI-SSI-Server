const Issuer = require("../models/Issuer");

const BlockchainService = require("../services/BlockchainService");

const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

module.exports.addIssuer = async function (did, name) {
	// Verificar que el issuer no exista
	const byDIDExist = await Issuer.getByDID(did);
	if (byDIDExist) throw Messages.ISSUER.ERR.DID_EXISTS;

	try {
		const res = await BlockchainService.addDelegate(did);
		console.log(res);	
	} catch (e) {
		throw Messages.ISSUER.ERR.COULDNT_PERSIST;
	}

	const expireOn = new Date();
	if (Constants.BLOCKCHAIN.DELEGATE_DURATION) {
		expireOn.setSeconds(expireOn.getSeconds() + Number(Constants.BLOCKCHAIN.DELEGATE_DURATION));
	}

	return await Issuer.create({ name, did, expireOn });
};

module.exports.getIssuerByDID = async function (did) {
	return await Issuer.getByDID(did);
};
