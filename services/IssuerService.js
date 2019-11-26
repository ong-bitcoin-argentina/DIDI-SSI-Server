const Issuer = require("../models/Issuer");
const Messages = require("../constants/Messages");

// autoriza al did a emitir certificados
module.exports.create = async function(did) {
	try {
		let issuer = await Issuer.generate(did);
		if (!issuer) return Promise.reject(Messages.ISSUER.ERR.CREATE);
		return Promise.resolve(issuer);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}
};

// revoca la autorizacion del did para emitir certificados
module.exports.delete = async function(did) {
	try {
		let issuer = await Issuer.delete(did);
		if (!issuer) return Promise.reject(Messages.ISSUER.ERR.DELETE);
		return Promise.resolve(issuer);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}
};

// indica si el did esta o no autorizado a emitir certificados
module.exports.isValid = async function(did) {
	try {
		let isValid = await Issuer.isValid(did);
		return Promise.resolve(isValid);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.ISSUER.ERR.COMMUNICATION_ERROR);
	}
};
