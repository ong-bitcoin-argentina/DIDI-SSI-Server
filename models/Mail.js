const mongoose = require("mongoose");
const Constants = require("../constants/Constants");
const Hashing = require("./utils/Hashing");

const MailSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	did: {
		type: String,
		required: true
	},
	code: {
		salt: {
			type: String,
			required: true
		},
		hash: {
			type: String,
			required: true
		}
	},
	validated: {
		type: Boolean,
		default: false
	},
	createdOn: {
		type: Date,
		default: Date.now()
	},
	expiresOn: {
		type: Date
	}
});

MailSchema.index(
	{ did: 1 },
	{
		unique: true
	}
);

MailSchema.methods.expired = function() {
	return this.expiresOn.getTime() < new Date().getTime();
};

MailSchema.methods.validateMail = async function(code) {
	try {
		const isMatch = Hashing.validateHash(code, this.code);
		if (!isMatch) return Promise.resolve(this);

		let quiery = { _id: this._id };
		let action = { $set: { validated: true } };
		await Mail.findOneAndUpdate(quiery, action);

		this.validated = true;
		return Promise.resolve(this);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

const Mail = mongoose.model("Mail", MailSchema);
module.exports = Mail;

Mail.generate = async function(email, code, did) {
	let mail;
	try {
		const query = { did: did };
		mail = await Mail.findOne(query);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	if (!mail) {
		mail = new Mail();
	}

	mail.email = email;
	mail.did = did;
	mail.validated = false;
	mail.createdOn = new Date();

	let date = new Date();
	date.setHours(date.getHours() + Constants.HOURS_BEFORE_CODE_EXPIRES);
	mail.expiresOn = date;

	try {
		mail.code = Hashing.hash(code);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	try {
		mail = await mail.save();
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Mail.get = async function(did) {
	try {
		const query = { did: did, validated: false };
		let mail = await Mail.findOne(query);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
