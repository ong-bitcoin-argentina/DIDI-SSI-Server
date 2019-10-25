var User = require("../models/User");
var Messages = require("../constants/Messages");

class UserService {
	static login(name, pass, cb, errCb) {
		return User.getByName(
			name,
			function(user) {
				return user.comparePassword(pass, function(err, res) {
					if (err) return errCb(err);
					return cb(res);
				});
			},
			errCb
		);
	}

	static getAll(cb, errCb) {
		return User.getAll(function(users) {
			return cb(users);
		}, errCb);
	}

	static get(userId, cb, errCb) {
		return User.getById(
			userId,
			function(user) {
				return cb(user);
			},
			errCb
		);
	}

	static create(name, pass, cb, errCb) {
		User.generate(
			name,
			pass,
			function(user) {
				if (!user) return errCb(Messages.USER.ERR.CREATE);
				return cb(user);
			},
			errCb
		);
	}

	static edit(userId, name, cb, errCb) {
		return User.getById(
			userId,
			function(user) {
				if (!user) return errCb(Messages.USER.ERR.GET);
				User.edit(
					user._id,
					{ name: name },
					function(user) {
						if (!user) return errCb(Messages.USER.ERR.EDIT);
						return cb(user);
					},
					errCb
				);
			},
			errCb
		);
	}

	static delete(userId, cb, errCb) {
		return User.getById(
			userId,
			function(user) {
				if (!user) return errCb(Messages.USER.ERR.GET);
				User.edit(
					user._id,
					{ deleted: true },
					function(user) {
						if (!user) return errCb(Messages.USER.ERR.DELETE);
						return cb(user);
					},
					errCb
				);
			},
			errCb
		);
	}
}

module.exports = UserService;
