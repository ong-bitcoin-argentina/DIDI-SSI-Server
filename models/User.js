const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
	mail: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	did: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
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
	{ did: 1 },
	{
		unique: true
	}
);

UserSchema.index(
	{ mail: 1 },
	{
		unique: true
	}
);

UserSchema.pre("save", function(next) {
	var user = this;

	if (!user.isModified("password")) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb, errCb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return errCb(err);
		cb(isMatch);
	});
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

User.generate = function(did, seed, mail, phoneNumber, pass, cb, errCb) {
	var user = new User();

	user.mail = mail;
	user.phoneNumber = phoneNumber;
	user.did = did;
	user.seed = seed;
	user.createdOn = new Date();
	user.modifiedOn = new Date();
	user.password = pass;
	user.deleted = false;

	return user.save(function(err, user) {
		if (err) return errCb(err);
		return cb(user);
	});
};

User.getByDID = function(did, cb, errCb) {
	return User.findOne({ did: did, deleted: false }, function(err, user) {
		if (err) return errCb(err);
		return cb(user);
	});
};

User.getByDIDAndEmail = function(did, email, cb, errCb) {
	return User.findOne({ did: did, mail: email, deleted: false }, function(err, user) {
		if (err) return errCb(err);
		return cb(user);
	});
};

User.getByEmail = function(email, cb, errCb) {
	return User.findOne({ mail: email, deleted: false }, function(err, user) {
		if (err) return errCb(err);
		return cb(user);
	});
};
