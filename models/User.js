const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");

const UserSchema = new mongoose.Schema({
	mail: {
		type: String,
		required: true
	},
	oldEmails: [
		{
			type: String
		}
	],
	phoneNumber: {
		type: String,
		required: true
	},
	oldPhoneNumbers: [
		{
			type: String
		}
	],
	did: {
		type: String,
		required: true
	},
	password: {
		salt: {
			type: String,
			required: true
		},
		hash: {
			type: String,
			required: true
		}
	},
	seed: {
		type: String,
		required: true
	},
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
	{ mail: 1, deleted: 1 },
	{
		unique: true
	}
);

UserSchema.methods.comparePassword = async function(candidatePassword) {
	try {
		const result = Hashing.validateHash(candidatePassword, this.password);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

UserSchema.methods.updatePassword = async function(password) {
	const hashData = Hashing.hash(password);

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
	if (this.phoneNumber == newPhoneNumber) {
		return Promise.resolve(this);
	}

	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { phoneNumber: newPhoneNumber, modifiedOn: new Date() },
		$push: { oldPhoneNumbers: this.phoneNumber }
	};

	try {
		await User.findOneAndUpdate(updateQuery, updateAction);
		this.oldPhoneNumbers.push(this.phoneNumber);
		this.phoneNumber = newPhoneNumber;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

UserSchema.methods.updateEmail = async function(newEmail) {
	if (this.mail == newEmail) {
		return Promise.resolve(this);
	}

	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { mail: newEmail, modifiedOn: new Date() },
		$push: { oldEmails: this.mail }
	};

	try {
		await User.findOneAndUpdate(updateQuery, updateAction);
		this.oldEmails.push(this.mail);
		this.mail = newEmail;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

// crear nuevo usuario
User.generate = async function(did, seed, mail, phoneNumber, pass) {
	let user = new User();
	user.mail = mail;
	user.oldEmails = [];
	user.phoneNumber = phoneNumber;
	user.oldPhoneNumbers = [];
	user.did = did;
	user.seed = seed;
	user.createdOn = new Date();
	user.modifiedOn = new Date();
	user.deleted = false;

	try {
		user.password = Hashing.hash(pass);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	try {
		user = await user.save();
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

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

User.getByEmail = async function(email) {
	try {
		const query = { mail: email, deleted: false };
		let user = await User.findOne(query);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
