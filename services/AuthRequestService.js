const Messages = require("../constants/Messages");
const AuthRequest = require("../models/AuthRequest");

// crear y guardar pedido de validacion de identidad
module.exports.create = async function(operationId, userDID) {
	try {
		let authRequest = await AuthRequest.generate(operationId, userDID);
		if (!authRequest) return Promise.reject(Messages.RENAPER.CREATE);
		return Promise.resolve(authRequest);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

// obtiene el pedido de validacion a partir del codigo de operacion
module.exports.getByOperationId = async function(operationId) {
	try {
		const authRequest = await AuthRequest.findByOperationId(operationId);
		if (!authRequest) return Promise.reject(Messages.RENAPER.GET);
		return Promise.resolve(authRequest);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

// actualiza el pedido de validacion
module.exports.update = async function(status, errMsg) {
	try {
		let authRequest = await AuthRequest.findByOperationId(operationId);
		if (!authRequest) return Promise.reject(Messages.RENAPER.GET);
		authRequest = await authRequest.update(status, errMsg);
		if (!authRequest) return Promise.reject(Messages.RENAPER.UPDATE);
		return Promise.resolve(authRequest);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};
