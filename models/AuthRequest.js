const mongoose = require("mongoose");
const Constants = require("../constants/Constants");

const statuses = [
	Constants.AUTHENTICATION_REQUEST.IN_PROGRESS,
	Constants.AUTHENTICATION_REQUEST.SUCCESSFUL,
	Constants.AUTHENTICATION_REQUEST.FALIED
];

// Registra la informacion de un pedido de validacion de identidad contra Renaper
const AuthRequestSchema = new mongoose.Schema({
	operationId: {
		type: String,
		required: true
	},
	userDID: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: statuses,
		required: true
	},
	errorMessage: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

AuthRequestSchema.index({ operationId: 1 });

// actualizar estado del pedido
AuthRequestSchema.methods.update = async function(status, errorMessage) {
	try {
		this.status = status;
		if (errorMessage) this.errorMessage = errorMessage;
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// retorna el did del usuario a validar
AuthRequestSchema.methods.getDid = async function() {
	return this.userDID;
};

const AuthRequest = mongoose.model("AuthRequest", AuthRequestSchema);
module.exports = AuthRequest;

// inicailizar registro de un pedido nuevo
AuthRequest.generate = async function(operationId, userDID) {
	try {
		const req = await AuthRequest.findByOperationId(operationId);
		if (req) return Promise.resolve(null);

		let request = new AuthRequest();
		request.operationId = operationId;
		request.userDID = userDID;
		request.status = Constants.AUTHENTICATION_REQUEST.IN_PROGRESS;
		request.createdOn = new Date();

		request = await request.save();
		return Promise.resolve(request);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// retorna el pedido buscandolo por 'operationId'
AuthRequest.findByOperationId = async function(operationId) {
	try {
		const query = { operationId: operationId };
		const request = await AuthRequest.findOne(query);
		return Promise.resolve(request);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
