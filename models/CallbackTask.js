const mongoose = require("mongoose");

const CallbackTaskSchema = new mongoose.Schema({
	status: {
		type: String,
		required: true
	},
	actionTag: {
		type: String,
		default: "Post"
	},
	callbackUrl: {
		type: String,
		required: true
	},
	did: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	},
	expireOn: String,
	blockHash: String,
	messageError: String
});

const CallbackTask = mongoose.model("CallbackTask", CallbackTaskSchema);
module.exports = CallbackTask;
