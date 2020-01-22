const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");

const PhoneSchema = new mongoose.Schema({
	phoneNumber: {
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

PhoneSchema.index(
	{ phoneNumber: 1 },
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
		const isMatch = Hashing.validateHash(code, this.code);
		return Promise.resolve(isMatch);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// actualizar flag "validated"
PhoneSchema.methods.validatePhone = async function(did) {
	try {
		let quiery = { _id: this._id };
		let action = { $set: { validated: true, did: did } };

		await Phone.findOneAndUpdate(quiery, action);

		this.validated = true;
		return Promise.resolve(this);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

const Phone = mongoose.model("Phone", PhoneSchema);
module.exports = Phone;

// crear nuevo pedido de validacion de tel, o pisar el anterior si hay otro con el mismo did
Phone.generate = async function(phoneNumber, code, did) {
	let phone;
	try {
		const query = { phoneNumber: phoneNumber };
		phone = await Phone.findOne(query);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	if (!phone) {
		phone = new Phone();
	}

	phone.phoneNumber = phoneNumber;
	phone.did = did;
	phone.createdOn = new Date();
	phone.validated = false;

	let date = new Date();
	date.setHours(date.getHours() + 1);
	phone.expiresOn = date;

	try {
		phone.code = Hashing.hash(code);
	} catch (err) {
		return Promise.reject(err);
	}

	try {
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
		const query = { phoneNumber: phoneNumber, validated: false };
		let phone = await Phone.findOne(query);
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Phone.isValidated = async function(did, phoneNumber) {
	try {
		const query = { did: did, phoneNumber: phoneNumber };
		let phone = await Phone.findOne(query);
		return Promise.resolve(phone ? phone.validated : false);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
