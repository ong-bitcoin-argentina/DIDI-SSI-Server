const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");

const PhoneSchema = new mongoose.Schema({
	phoneNumber: {
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

PhoneSchema.index(
	{ did: 1 },
	{
		unique: true
	}
);

PhoneSchema.methods.expired = function() {
	return this.expiresOn.getTime() < new Date().getTime();
};

PhoneSchema.methods.validatePhone = async function(code) {
	try {
		const isMatch = Hashing.validateHash(code, this.code);
		if (!isMatch) return Promise.resolve(this);

		let quiery = { _id: this._id };
		let action = { $set: { validated: true } };
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

Phone.generate = async function(phoneNumber, code, did) {
	let phone;
	try {
		const query = { did: did };
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

Phone.get = async function(did) {
	try {
		const query = { did: did, validated: false };
		let phone = await Phone.findOne(query);
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
