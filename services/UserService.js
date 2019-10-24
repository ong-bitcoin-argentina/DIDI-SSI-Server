var User = require("../models/User");
var Messages = require("../constants/Messages");

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

class UserService {
	static getAll(cb, errCb) {
		return User.find({ deleted: false }, function(err, users) {
			if (err) return errCb(err);
			return cb(users);
		});
	}

	static get(userId, cb, errCb) {
		return User.findOne({ _id: ObjectId(userId), deleted: false }, function(err, user) {
			if (err) return errCb(err);
			return cb(user);
		});
	}

	static create(name, cb, errCb) {
		var user = new User();

		user.name = name;
		user.createdOn = new Date();
		user.modifiedOn = new Date();
		user.deleted = false;

		return user.save(function(err, user) {
			if (err) return errCb(err);
			if (!user) return errCb(Messages.USER.ERR.CREATE);
			return cb(user);
		});
	}

	static edit(userId, name, cb, errCb) {
		return User.findOneAndUpdate({ _id: ObjectId(userId) }, { $set: { name: name } }, function(err, user) {
			if (err) return errCb(err);
			if (!user) return errCb(Messages.USER.ERR.EDIT);

			user.name = name;
			return cb(user);
		});
	}

	static delete(userId, cb, errCb) {
		return User.findOneAndUpdate({ _id: ObjectId(userId) }, { $set: { deleted: true } }, function(err, user) {
			if (err) return errCb(err);
			if (!user) return errCb(Messages.USER.ERR.DELETE);

			user.deleted = true;
			return cb(user);
		});
	}
}

module.exports = UserService;
