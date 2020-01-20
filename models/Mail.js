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
		required: false
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
	{ email: 1 },
	{
		unique: true
	}
);

// verificar si el pedido de validacion de telefono expirò
MailSchema.methods.expired = function() {
	return this.expiresOn.getTime() < new Date().getTime();
};

// comparar codigos de validacion
MailSchema.methods.isValid = async function(code) {
	try {
		const isMatch = Hashing.validateHash(code, this.code);
		return Promise.resolve(isMatch);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// comparar codigos de validacion y actualizar flag "validated"
MailSchema.methods.validateMail = async function(did) {
	try {
		let quiery = { _id: this._id };
		let action = { $set: { validated: true, did: did } };

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

// crear nuevo pedido de validacion de mail, o pisar el anterior si hay otro con el mismo did
Mail.generate = async function(email, code, did) {
	let mail;
	try {
		const query = { email: email };
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

// obtener por mail
Mail.getByEmail = async function(email) {
	try {
		const query = { email: email, validated: false };
		let mail = await Mail.findOne(query);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Mail.isValidated = async function(did, email) {
	try {
		const query = { did: did, email: email };
		let mail = await Mail.findOne(query);
		return Promise.resolve(mail ? mail.validated : false);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
