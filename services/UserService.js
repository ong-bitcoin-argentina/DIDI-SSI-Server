// const User = require("../models/User");
const Messages = require("../constants/Messages");

class UserService {
	/*
	static login(name, pass, cb, errCb) {
		return User.getByName(
			name,
			function(user) {
				return user.comparePassword(pass, function(err, res) {
					if (err) {
						console.log(err);
						return errCb(Messages.USER.ERR.LOGIN);
					}
					return cb(res);
				});
			},
			function(err) {
				console.log(err);
				errCb(Messages.USER.ERR.LOGIN);
			}
		);
	}

	static getAll(cb, errCb) {
		return User.getAll(
			function(users) {
				return cb(users);
			},
			function(err) {
				console.log(err);
				errCb(Messages.USER.ERR.GET_ALL);
			}
		);
	}

	static get(userId, cb, errCb) {
		return User.getById(
			userId,
			function(user) {
				return cb(user);
			},
			function(err) {
				console.log(err);
				errCb(Messages.USER.ERR.GET_ALL);
			}
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
			function(err) {
				console.log(err);
				errCb(Messages.USER.ERR.CREATE);
			}
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
					function(err) {
						console.log(err);
						errCb(Messages.USER.ERR.EDIT);
					}
				);
			},
			function(err) {
				console.log(err);
				errCb(Messages.USER.ERR.GET);
			}
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
					function(err) {
						console.log(err);
						errCb(Messages.USER.ERR.DELETE);
					}
				);
			},
			function(err) {
				console.log(err);
				errCb(Messages.USER.ERR.GET);
			}
		);
	}
	*/
}

module.exports = UserService;
