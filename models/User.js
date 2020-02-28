const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");
const Encrypt = require("./utils/Encryption");
const EncryptedData = require("./dataTypes/EncryptedData");
const HashedData = require("./dataTypes/HashedData");
const Messages = require("../constants/Messages");

// Registra la informacion correspondiente a un usuario de didi
const UserSchema = new mongoose.Schema({
	did: {
		type: String,
		required: true
	},

	mail: EncryptedData,
	oldEmails: [EncryptedData],

	phoneNumber: EncryptedData,
	oldPhoneNumbers: [EncryptedData],

	seed: EncryptedData,

	backupHash: {
		type: String
	},
	firebaseId: {
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
	{ did: 1, deleted: 1 },
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

// retorna clave privada del usuario
UserSchema.methods.getSeed = async function() {
	try {
		const result = await Encrypt.decript(this.seed.encrypted);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// compara los campos hasheados
UserSchema.methods.compareField = async function(name, candidate) {
	try {
		const result = await Hashing.validateHash(candidate, this[name]);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// actualiza la contraseña del usuario
UserSchema.methods.updatePassword = async function(password) {
	// hashear clave
	const hashData = await Hashing.saltedHash(password);

	// actualizar clave
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

// actualiza el id de firebase
UserSchema.methods.updateFirebaseId = async function(firebaseId) {
	// actualizar firebaseId
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { firebaseId: firebaseId, modifiedOn: new Date() }
	};

	try {
		await User.findOneAndUpdate(updateQuery, updateAction);
		this.firebaseId = firebaseId;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

// actualiza el numero de telefono asociado al usuario
UserSchema.methods.updatePhoneNumber = async function(newPhoneNumber, firebaseId) {
	const oldPhone = {
		encrypted: this.phoneNumber.encrypted,
		// salt: this.phoneNumber.salt,
		hash: this.phoneNumber.hash
	};

	// encriptar numero
	await Encrypt.setEncryptedData(this, "phoneNumber", newPhoneNumber);
	// si no hay cambio, retornar
	if (oldPhone.hash === this.phoneNumber.hash) return Promise.resolve(this);

	for (let old of this.oldPhoneNumbers) {
		const oldValue = await Encrypt.decript(old.encrypted);
		if (oldValue === newPhoneNumber) {
			return Promise.reject(Messages.USER.ERR.PHONE_DUPLICATED);
		}
	}

	// actualizar numero
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { phoneNumber: this.phoneNumber, firebaseId: firebaseId, modifiedOn: new Date() },
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

// actualiza el mail asociado al usuario
UserSchema.methods.updateEmail = async function(newEmail) {
	const oldMail = {
		encrypted: this.mail.encrypted,
		// salt: this.mail.salt,
		hash: this.mail.hash
	};

	// encriptar mail
	await Encrypt.setEncryptedData(this, "mail", newEmail);
	// si no hay cambio, retornar
	if (oldMail.hash === this.mail.hash) return Promise.resolve(this);

	for (let old of this.oldEmails) {
		const oldValue = await Encrypt.decript(old.encrypted);
		if (oldValue === newEmail) {
			return Promise.reject(Messages.USER.ERR.MAIL_DUPLICATED);
		}
	}

	// actualizar mail
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

// actualiza el hash de backup (swarm)
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

// retornar mail asociado al usuario
UserSchema.methods.getMail = async function() {
	return await Encrypt.getEncryptedData(this, "mail");
};

// retornar numero de telefono asociado al usuario
UserSchema.methods.getPhoneNumber = async function() {
	return await Encrypt.getEncryptedData(this, "phoneNumber");
};

// retornar did asociado al usuario
UserSchema.methods.getDid = async function() {
	return (this.did = did);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

// crear nuevo usuario
User.generate = async function(did, seed, mail, phoneNumber, pass, firebaseId) {
	try {
		let user = new User();
		user.oldEmails = [];
		user.oldPhoneNumbers = [];
		user.createdOn = new Date();
		user.modifiedOn = new Date();
		user.deleted = false;
		user.did = did;
		user.firebaseId = firebaseId;
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

// obtener usuario a partir del did
User.getByDID = async function(did) {
	try {
		const query = { did: did, deleted: false };
		let user = await User.findOne(query);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// obtener usuario a partir del mail
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

// obtener usuario a partir del numero de telefono
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
