/*
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: {
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
	{ name: 1 },
	{
		unique: true
	}
);

UserSchema.pre("save", function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

UserSchema.methods.getPublicData = function() {
	return {
		name: this.name
	};
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

User.getAll = function(cb, errCb) {
	return User.find({ deleted: false }, function(err, users) {
		if (err) return errCb(err);
		return cb(users.map(user => user));
	});
};

User.getById = function(id, cb, errCb) {
	return User.findOne({ _id: ObjectId(id), deleted: false }, function(err, user) {
		if (err) return errCb(err);
		return cb(user);
	});
};

User.getByName = function(name, cb, errCb) {
	return User.findOne({ name: name, deleted: false }, function(err, user) {
		if (err) return errCb(err);
		return cb(user);
	});
};

User.generate = function(name, pass, cb, errCb) {
	var user = new User();

	user.name = name;
	user.createdOn = new Date();
	user.modifiedOn = new Date();
	user.password = pass;
	user.deleted = false;

	return user.save(function(err, user) {
		if (err) return errCb(err);
		return cb(user);
	});
};

User.edit = function(userId, data, cb, errCb) {
	return User.findOneAndUpdate({ _id: ObjectId(userId) }, { $set: data }, function(err, user) {
		if (err) return errCb(err);

		for (let key in Object.keys(data)) {
			user[key] = data[key];
		}

		return cb(user);
	});
};
*/