const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");
const Encrypt = require("./utils/Encryption");
const EncryptedData = require("./dataTypes/EncryptedData");
const HashedData = require("./dataTypes/HashedData");

const UserSchema = new mongoose.Schema({
	did: EncryptedData,

	mail: EncryptedData,
	oldEmails: [EncryptedData],

	phoneNumber: EncryptedData,
	oldPhoneNumbers: [EncryptedData],

	seed: EncryptedData,

	backupHash: {
		type: String
	},

	password: HashedData,
	deleted: {
		type: Boolean,
		default: false
	},
	createdOn: {
		type: Date,
		default: Date.now()
	},
	modifiedOn: {
		type: Date,
		default: Date.now()
	}
});

UserSchema.index(
	{ "did.encrypted": 1, deleted: 1 },
	{
		unique: true
	}
);

UserSchema.index(
	{ "mail.encrypted": 1, deleted: 1 },
	{
		unique: true
	}
);

UserSchema.methods.getSeed = async function() {
	try {
		const result = await Encrypt.decript(this.seed.encrypted);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

UserSchema.methods.compareField = async function(name, candidate) {
	try {
		const result = await Hashing.validateHash(candidate, this[name]);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

UserSchema.methods.updatePassword = async function(password) {
	const hashData = await Hashing.saltedHash(password);

	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { password: hashData, modifiedOn: new Date() }
	};

	try {
		await User.findOneAndUpdate(updateQuery, updateAction);
		this.password = hashData;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

UserSchema.methods.updatePhoneNumber = async function(newPhoneNumber) {
	const oldPhone = {
		encrypted: this.phoneNumber.encrypted,
		// salt: this.phoneNumber.salt,
		hash: this.phoneNumber.hash
	};

	await Encrypt.setEncryptedData(this, "phoneNumber", newPhoneNumber);
	if (oldPhone.hash === this.phoneNumber.hash) return Promise.resolve(this);

	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { phoneNumber: this.phoneNumber, modifiedOn: new Date() },
		$push: { oldPhoneNumbers: oldPhone }
	};

	try {
		await User.findOneAndUpdate(updateQuery, updateAction);
		this.oldPhoneNumbers.push(this.phoneNumber);
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

UserSchema.methods.updateEmail = async function(newEmail) {
	const oldMail = {
		encrypted: this.mail.encrypted,
		// salt: this.mail.salt,
		hash: this.mail.hash
	};

	await Encrypt.setEncryptedData(this, "mail", newEmail);

	if (oldMail.hash === this.mail.hash) return Promise.resolve(this);

	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { mail: this.mail, modifiedOn: new Date() },
		$push: { oldEmails: oldMail }
	};

	try {
		await User.findOneAndUpdate(updateQuery, updateAction);
		this.oldEmails.push(oldMail);
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

UserSchema.methods.updateHash = async function(hash) {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { backupHash: hash, modifiedOn: new Date() }
	};

	try {
		await User.findOneAndUpdate(updateQuery, updateAction);
		this.backupHash = hash;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

UserSchema.methods.getMail = async function() {
	return await Encrypt.getEncryptedData(this, "mail");
};

UserSchema.methods.getPhoneNumber = async function() {
	return await Encrypt.getEncryptedData(this, "phoneNumber");
};

UserSchema.methods.getDid = async function() {
	return await Encrypt.getEncryptedData(this, "did");
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

// crear nuevo usuario
User.generate = async function(did, seed, mail, phoneNumber, pass) {
	try {
		let user = new User();
		user.oldEmails = [];
		user.oldPhoneNumbers = [];
		user.createdOn = new Date();
		user.modifiedOn = new Date();
		user.deleted = false;

		await Encrypt.setEncryptedData(user, "did", did);
		await Encrypt.setEncryptedData(user, "phoneNumber", phoneNumber);
		await Encrypt.setEncryptedData(user, "mail", mail);
		await Encrypt.setEncryptedData(user, "seed", seed);
		user.password = await Hashing.saltedHash(pass);

		user = await user.save();
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

User.getByDID = async function(did) {
	try {
		const hashData = await Hashing.hash(did);
		const query = { "did.hash": hashData.hash, deleted: false };
		let user = await User.findOne(query);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

User.getByEmail = async function(email) {
	try {
		const hashData = await Hashing.hash(email);
		const query = { "mail.hash": hashData.hash, deleted: false };
		let user = await User.findOne(query);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

User.getByTel = async function(phoneNumber) {
	try {
		const hashData = await Hashing.hash(phoneNumber);
		const query = { "phoneNumber.hash": hashData.hash, deleted: false };
		let user = await User.findOne(query);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
