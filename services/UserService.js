const User = require("../models/User");
const Messages = require("../constants/Messages");

class UserService {
	static create(did, privateKeySeed, userMail, phoneNumber, userPass, cb, errCb) {
		User.getByDID(
			did,
			function(user) {
				if (user) return errCb(Messages.USER.ERR.USER_ALREADY_EXIST);
				User.generate(
					did,
					privateKeySeed,
					userMail,
					phoneNumber,
					userPass,
					function(user) {
						if (!user) return errCb(Messages.USER.ERR.CREATE);
						return cb(user);
					},
					function(err) {
						console.log(err);
						errCb(Messages.USER.ERR.COMMUNICATION_ERROR);
					}
				);
			},
			function(err) {
				console.log(err);
				errCb(Messages.USER.ERR.COMMUNICATION_ERROR);
			}
		);
	}

	static login(did, email, pass, cb, errCb) {
		return User.getByDIDAndEmail(
			did,
			email,
			function(user) {
				if (!user) return errCb(Messages.USER.ERR.NOMATCH_USER_DID);
				return user.comparePassword(
					pass,
					function(isMatch) {
						if (!isMatch) return errCb(Messages.USER.ERR.INVALID_USER);
						return cb();
					},
					function(err) {
						console.log(err);
						return errCb(Messages.USER.ERR.INVALID_USER);
					}
				);
			},
			function(err) {
				console.log(err);
				return errCb(Messages.USER.ERR.COMMUNICATION_ERROR);
			}
		);
	}

	static recoverAccount(mail, pass, cb, errCb) {
		return User.getByEmail(
			mail,
			function(user) {
				if (!user) return errCb(Messages.USER.ERR.NOMATCH_USER_EMAIL);
				return user.comparePassword(
					pass,
					function(isMatch) {
						if (!isMatch) return errCb(Messages.USER.ERR.INVALID_USER);
						return cb(user.seed);
					},
					function(err) {
						console.log(err);
						return errCb(Messages.USER.ERR.INVALID_USER);
					}
				);
			},
			function(err) {
				console.log(err);
				return errCb(Messages.USER.ERR.COMMUNICATION_ERROR);
			}
		);
	}

	static changePassword(did, email, oldPass, newPass, cb, errCb) {
		return User.getByDIDAndEmail(
			did,
			email,
			function(user) {
				if (!user) return errCb(Messages.USER.ERR.NOMATCH_USER_DID);
				return user.comparePassword(
					oldPass,
					function(isMatch) {
						if (!isMatch) return errCb(Messages.USER.ERR.INVALID_USER);
						return user.updatePassword(
							newPass,
							function(user) {
								return cb(user);
							},
							function(err) {
								console.log(err);
								return errCb(Messages.USER.ERR.UPDATE);
							}
						);
					},
					function(err) {
						console.log(err);
						return errCb(Messages.USER.ERR.INVALID_USER);
					}
				);
			},
			function(err) {
				console.log(err);
				return errCb(Messages.USER.ERR.COMMUNICATION_ERROR);
			}
		);
	}

	static recoverPassword(did, email, newPass, cb, errCb) {
		return User.getByDIDAndEmail(
			did,
			email,
			function(user) {
				if (!user) return errCb(Messages.USER.ERR.NOMATCH_USER_DID);
				return user.updatePassword(
					newPass,
					function(user) {
						return cb(user);
					},
					function(err) {
						console.log(err);
						return errCb(Messages.USER.ERR.UPDATE);
					}
				);
			},
			function(err) {
				console.log(err);
				return errCb(Messages.USER.ERR.COMMUNICATION_ERROR);
			}
		);
	}
}

module.exports = UserService;
