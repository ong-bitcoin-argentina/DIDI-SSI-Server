const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");
const Encrypt = require("./utils/Encryption");
const EncryptedData = require("./dataTypes/EncryptedData");
const HashedData = require("./dataTypes/HashedData");

const Constants = require("../constants/Constants");

const MailSchema = new mongoose.Schema({
	email: EncryptedData,
	did: EncryptedData,
	code: HashedData,
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
	{ "email.encrypted": 1 },
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
		const isMatch = await Hashing.validateHash(code, this.code);
		return Promise.resolve(isMatch);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// comparar codigos de validacion y actualizar flag "validated"
MailSchema.methods.validateMail = async function(did) {
	try {
		await this.setEncryptedData("did", did);

		let quiery = { _id: this._id };
		let action = { $set: { validated: true, did: this.did } };

		await Mail.findOneAndUpdate(quiery, action);

		this.validated = true;
		return Promise.resolve(this);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

MailSchema.methods.setEncryptedData = async function(name, data) {
	try {
		const encrypted = await Encrypt.encrypt(data);
		const hashData = await Hashing.hash(data);

		if (this[name].hash === hashData.hash) return Promise.resolve(this);

		const encryptedData = {
			encrypted: encrypted,
			// salt: hashData.salt,
			hash: hashData.hash
		};
		this[name] = encryptedData;
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

MailSchema.methods.getEncryptedData = async function(name) {
	try {
		const encrypted = this[name];
		return await Encrypt.decript(encrypted);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

MailSchema.methods.getMail = async function() {
	return this.getEncryptedData("email");
}

MailSchema.methods.getDid = async function() {
	return this.getEncryptedData("did");
}

const Mail = mongoose.model("Mail", MailSchema);
module.exports = Mail;

// crear nuevo pedido de validacion de mail, o pisar el anterior si hay otro con el mismo did
Mail.generate = async function(email, code, did) {
	try {
		const query = { email: email };
		let mail = await Mail.findOne(query);

		if (!mail) mail = new Mail();

		mail.validated = false;
		mail.createdOn = new Date();

		let date = new Date();
		date.setHours(date.getHours() + Constants.HOURS_BEFORE_CODE_EXPIRES);
		mail.expiresOn = date;

		if (did) await mail.setEncryptedData("did", did);
		await mail.setEncryptedData("email", email);
		mail.code = await Hashing.saltedHash(code);

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
		const hashData = await Hashing.hash(email);
		const query = { "email.hash": hashData.hash, validated: false };
		let mail = await Mail.findOne(query);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Mail.isValidated = async function(did, email) {
	try {
		const hashData = await Hashing.hash(email);
		const didHashData = await Hashing.hash(did);

		const query = { "did.hash": didHashData.hash, "email.hash": hashData.hash };
		let mail = await Mail.findOne(query);

		return Promise.resolve(mail ? mail.validated : false);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
