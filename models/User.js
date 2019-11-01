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
	{ did: 1, mail: 1, deleted: 1 },
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

UserSchema.methods.comparePassword = function(candidatePassword, cb, errCb) {
	try {
		const result = Hashing.validateHash(candidatePassword, this.password);
		return cb(result);
	} catch (err) {
		console.log(err);
		return errCb(err);
	}
};

UserSchema.methods.updatePassword = function(password, cb, errCb) {
	var user = this;
	const hashData = Hashing.hash(password);

	return User.findOneAndUpdate({ _id: user._id }, { $set: { password: hashData, modifiedOn: new Date() } }, function(
		err,
		_
	) {
		if (err) return errCb(err);
		user.password = hashData;
		return cb(user);
	});
};

UserSchema.methods.updatePhoneNumber = function(newPhoneNumber, cb, errCb) {
	var user = this;

	const updateQuery = {
		$set: { phoneNumber: newPhoneNumber, modifiedOn: new Date() },
		$push: { oldPhoneNumbers: user.phoneNumber }
	};

	return User.findOneAndUpdate({ _id: user._id }, updateQuery, function(err, _) {
		if (err) return errCb(err);
		user.oldPhoneNumbers.push(user.phoneNumber);
		user.phoneNumber = newPhoneNumber;
		return cb(user);
	});
};

UserSchema.methods.updateEmail = function(newEmail, cb, errCb) {
	var user = this;

	const updateQuery = {
		$set: { mail: newEmail, modifiedOn: new Date() },
		$push: { oldEmails: user.mail }
	};

	return User.findOneAndUpdate({ _id: user._id }, updateQuery, function(err, _) {
		if (err) return errCb(err);
		user.oldEmails.push(user.mail);
		user.mail = newEmail;
		return cb(user);
	});
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

User.generate = function(did, seed, mail, phoneNumber, pass, cb, errCb) {
	return User.findOne(
		{ did: did, email: mail, deleted: false },
		{},
		function(err, user) {
			if (err) return errCb(err);

			if (!user) {
				user = new User();
			}

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
				return errCb(err);
			}

			return user.save(function(err, user) {
				if (err) return errCb(err);
				return cb(user);
			});
		},
		errCb
	);
};

User.getByDIDAndEmail = function(did, email, cb, errCb) {
	return User.findOne({ did: did, mail: email, deleted: false }, {}, function(err, user) {
		if (err) return errCb(err);
		return cb(user);
	});
};

User.getByEmail = function(email, cb, errCb) {
	return User.findOne({ mail: email, deleted: false }, {}, function(err, user) {
		if (err) return errCb(err);
		return cb(user);
	});
};
