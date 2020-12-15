const Constants = require("../constants/Constants");
const { BlockchainManager } = require("@proyecto-didi/didi-blockchain-manager");
const IssuerService = require("../services/IssuerService");

const Messages = require("../constants/Messages");
const { SERVER_PRIVATE_KEY, SERVER_DID } = require("../constants/Constants");

//Instanciate Blockchain Manager
const config = {
	gasPrice: 10000,
	providerConfig: Constants.BLOCKCHAIN.PROVIDER_CONFIG // for multiblockchain
};

const blockchainManager = new BlockchainManager(config, Constants.BLOCKCHAIN.GAS_INCREMENT);

// realiza una delegacion de "serverDID" a "issuer"
module.exports.addDelegate = async function (issuerDID) {
	try {
		const credentials = {
			did: Constants.SERVER_DID,
			privateKey: Constants.SERVER_PRIVATE_KEY
		};
		return await blockchainManager.addDelegate(credentials, issuerDID, Constants.BLOCKCHAIN.DELEGATE_DURATION);
	} catch (err) {
		console.log(err);
		return Promise.reject(err.toString());
	}
};

// anula la delegacion de "userDID" a "otherDID" de existir esta
module.exports.revokeDelegate = async function (otherDID) {
	try {
		const issuer = await IssuerService.getIssuerByDID(otherDID);

		if (!issuer) Promise.reject(Messages.ISSUER.ERR.NOT_FOUND);
		await blockchainManager.revokeDelegate({ did: SERVER_DID, privateKey: SERVER_PRIVATE_KEY }, otherDID);
		return await issuer.delete();
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.DELETE);
	}
};

// retorna true si "userDID" realizo una delegacion de DID a "otherDID"
module.exports.validDelegate = async function (issuerDID) {
	try {
		return await blockchainManager.validateDelegate(Constants.SERVER_DID, issuerDID);
	} catch (err) {
		console.log(err);
		throw Messages.DELEGATE.ERR.GET_DELEGATE;
	}
};
