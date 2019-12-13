const Issuer = require("../models/Issuer");
const Messages = require("../constants/Messages");

// autoriza al did a emitir certificados
module.exports.create = async function(did, name) {
	try {
		let issuer = await Issuer.generate(did, name);
		if (!issuer) return Promise.reject(Messages.ISSUER.ERR.CREATE);
		return Promise.resolve(issuer);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

// revoca la autorizacion del did para emitir certificados
module.exports.delete = async function(did) {
	try {
		let issuer = await Issuer.delete(did);
		return Promise.resolve(issuer);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

// indica si el did esta o no autorizado a emitir certificados
module.exports.getIssuer = async function(did) {
	try {
		let issuer = await Issuer.getIssuer(did);
		return Promise.resolve(issuer);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};
