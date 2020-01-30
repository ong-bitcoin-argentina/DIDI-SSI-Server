const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");
const Encrypt = require("./utils/Encryption");
const EncryptedData = require("./dataTypes/EncryptedData");
const HashedData = require("./dataTypes/HashedData");

const PhoneSchema = new mongoose.Schema({
	phoneNumber: EncryptedData,
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

PhoneSchema.index(
	{ "phoneNumber.encrypted": 1 },
	{
		unique: true
	}
);

// verificar si el pedido de validacion de telefono expirò
PhoneSchema.methods.expired = function() {
	return this.expiresOn.getTime() < new Date().getTime();
};

// comparar codigos de validacion
PhoneSchema.methods.isValid = async function(code) {
	try {
		const isMatch = await Hashing.validateHash(code, this.code);
		return Promise.resolve(isMatch);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// actualizar flag "validated"
PhoneSchema.methods.validatePhone = async function(did) {
	try {
		await Encrypt.setEncryptedData(this, "did", did);

		let quiery = { _id: this._id };
		let action = { $set: { validated: true, did: this.did } };

		await Phone.findOneAndUpdate(quiery, action);

		this.validated = true;
		return Promise.resolve(this);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

PhoneSchema.methods.getPhoneNumber = async function() {
	return await Encrypt.getEncryptedData(this, "phoneNumber");
};

PhoneSchema.methods.getDid = async function() {
	return await Encrypt.getEncryptedData(this, "did");
};

const Phone = mongoose.model("Phone", PhoneSchema);
module.exports = Phone;

// crear nuevo pedido de validacion de tel, o pisar el anterior si hay otro con el mismo did
Phone.generate = async function(phoneNumber, code, did) {
	try {
		const hashData = await Hashing.hash(phoneNumber);
		const query = { "phoneNumber.hash": hashData.hash };
		let phone = await Phone.findOne(query);

		if (!phone) phone = new Phone();

		if (did) await Encrypt.setEncryptedData(phone, "did", did);

		phone.createdOn = new Date();
		phone.validated = false;

		await Encrypt.setEncryptedData(phone, "phoneNumber", phoneNumber);

		let date = new Date();
		date.setHours(date.getHours() + 1);
		phone.expiresOn = date;

		phone.code = await Hashing.saltedHash(code);
		phone = await phone.save();
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// obtener por tel
Phone.getByPhoneNumber = async function(phoneNumber) {
	try {
		const hashData = await Hashing.hash(phoneNumber);
		const query = { "phoneNumber.hash": hashData.hash, validated: false };
		let phone = await Phone.findOne(query);
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Phone.isValidated = async function(did, phoneNumber) {
	try {
		const hashData = await Hashing.hash(phoneNumber);
		const didHashData = await Hashing.hash(did);

		const query = { "did.hash": didHashData.hash, "phoneNumber.hash": hashData.hash };
		let phone = await Phone.findOne(query);
		return Promise.resolve(phone ? phone.validated : false);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
