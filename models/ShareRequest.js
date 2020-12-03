const mongoose = require("mongoose");
const Encrypt = require("./utils/Encryption");

const ShareRequestSchema = new mongoose.Schema({
	jwt: {
		type: String,
		required: true
	},
	aud: {
		type: String,
		required: true
	},
	iss: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		index: { expires: "60m" }
	}
});

ShareRequestSchema.methods.delete = async function () {
	try {
		return await ShareRequest.findByIdAndDelete({ _id: this._id });
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

const ShareRequest = mongoose.model("ShareRequest", ShareRequestSchema);
module.exports = ShareRequest;

ShareRequest.generate = async function ({ jwt, ...rest }) {
	try {
		const jwtEncrypted = await Encrypt.encrypt(jwt);
		return ShareRequest.create({ jwt: jwtEncrypted, ...rest });
	} catch (error) {
		console.log(err);
		return Promise.reject(err);
	}
};

ShareRequest.getById = async function (_id) {
	const shareRequest = await ShareRequest.findById(_id);
	if (shareRequest) {
		const jwtDecripted = await Encrypt.decript(shareRequest.jwt);
		shareRequest.jwt = jwtDecripted;
	}
	return shareRequest;
};
