const Messages = require("../constants/Messages");
const AuthRequest = require("../models/AuthRequest");

/**
 *  Crea y guarda pedido de validación de identidad
 */
module.exports.create = async function (operationId, userDID) {
	try {
		let authRequest = await AuthRequest.generate(operationId, userDID);
		if (!authRequest) return Promise.reject(Messages.RENAPER.CREATE);
		return Promise.resolve(authRequest);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

/**
 *  Obtiene el pedido de validación a partir del código de operación
 */
module.exports.getByOperationId = async function (operationId) {
	try {
		const authRequest = await AuthRequest.findByOperationId(operationId);
		if (!authRequest) throw Messages.RENAPER.GET;
		return authRequest;
	} catch (err) {
		console.log(err);
		throw Messages.COMMUNICATION_ERROR;
	}
};

/**
 *  Indica si un determinado did posee una solicitud exitosa contra renaper
 */
module.exports.getByDID = async function (did) {
	try {
		const result = await AuthRequest.findByDid(did);
		if (!result) return null;
		const { createdOn, operationId, status } = result;
		return { createdOn, operationId, status };
	} catch (err) {
		console.log(err);
		throw Messages.COMMUNICATION_ERROR;
	}
};

/**
 *  Actualiza el pedido de validación
 */
module.exports.update = async function (status, errMsg) {
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
