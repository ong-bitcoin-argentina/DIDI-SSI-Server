const mongoose = require("mongoose");
const Constants = require("../constants/Constants");

const statuses = [
	Constants.AUTHENTICATION_REQUEST.IN_PROGRESS,
	Constants.AUTHENTICATION_REQUEST.SUCCESSFUL,
	Constants.AUTHENTICATION_REQUEST.FALIED
];

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

const AuthRequest = mongoose.model("AuthRequest", AuthRequestSchema);
module.exports = AuthRequest;

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
