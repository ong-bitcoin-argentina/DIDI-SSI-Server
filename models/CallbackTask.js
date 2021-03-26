const mongoose = require("mongoose");
const { JOBS } = require("../constants/Constants");
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
	attempts: {
		type: Number,
		default: 0,
	},
	expireOn: String,
	blockHash: String,
	messageError: String
});

CallbackTaskSchema.methods.addAttempt = async function () {
	
	const update = this.attempts > 7 
		? { $set: { status: JOBS.CANCEL_CALLBACK }}
		: { $inc: { attempts:1 }
	}
	return this.update(update);

};

const CallbackTask = mongoose.model("CallbackTask", CallbackTaskSchema);
module.exports = CallbackTask;
