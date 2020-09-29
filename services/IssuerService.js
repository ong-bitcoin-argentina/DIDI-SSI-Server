const Issuer = require("../models/Issuer");

const BlockchainService = require("../services/BlockchainService");

const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

module.exports.addIssuer = async function (did, name) {
	// Verificar que el issuer no exista
	const byNameExist = await Issuer.getByName(name);
	if (byNameExist) throw Messages.ISSUER.ERR.NAME_EXISTS;

  // Verificar que el issuer no exista
	const byDIDExist = await Issuer.getByDID(did);
	if (byDIDExist) throw Messages.ISSUER.ERR.DID_EXISTS;

	// Verificar que el did no figure como delegado actualmente
	const alreadyDelegated = await BlockchainService.validDelegate(
		Constants.SERVER_DID,
		{ from: Constants.SERVER_DID },
		did
  );
  if (alreadyDelegated) throw Messages.ISSUER.ERR.ALREADY_DELEGATE;

	await BlockchainService.addDelegate(
		Constants.SERVER_DID,
		{ from: Constants.SERVER_DID, key: Constants.SERVER_PRIVATE_KEY },
		did
	);

	const expireOn = new Date();
	expireOn.setSeconds(expireOn.getSeconds() + Constants.BLOCKCHAIN.DELEGATE_DURATION);

	return await Issuer.create({ name, did, expireOn });
};

module.exports.getIssuerByDID = async function(did) {
	return await Issuer.getByDID(did);
};