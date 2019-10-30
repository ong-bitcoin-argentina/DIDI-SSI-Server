const User = require("../models/User");
const Messages = require("../constants/Messages");

let _getAndValidate = function(did, email, pass, cb, errCb) {
	return User.getByDIDAndEmail(
		did,
		email,
		function(user) {
			if (!user) return errCb(Messages.USER.ERR.NOMATCH_USER_DID);
			return user.comparePassword(
				pass,
				function(isMatch) {
					if (!isMatch) return errCb(Messages.USER.ERR.INVALID_USER);
					return cb(user);
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
};

class UserService {
	static create(did, privateKeySeed, userMail, phoneNumber, userPass, cb, errCb) {
		User.getByDIDAndEmail(
			did,
			userMail,
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
		return _getAndValidate(did, email, pass, cb, errCb);
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

	static changeEmail(did, password, email, newMail, cb, errCb) {
		return _getAndValidate(
			did,
			email,
			password,
			function(user) {
				return user.updateEmail(
					newMail,
					function(user) {
						return cb(user);
					},
					function(err) {
						console.log(err);
						return errCb(Messages.USER.ERR.UPDATE);
					}
				);
			},
			errCb
		);
	}

	static changePhoneNumber(did, password, email, newPhoneNumber, cb, errCb) {
		return _getAndValidate(
			did,
			email,
			password,
			function(user) {
				return user.updatePhoneNumber(
					newPhoneNumber,
					function(user) {
						return cb(user);
					},
					function(err) {
						console.log(err);
						return errCb(Messages.USER.ERR.UPDATE);
					}
				);
			},
			errCb
		);
	}

	static changePassword(did, email, oldPass, newPass, cb, errCb) {
		return _getAndValidate(
			did,
			email,
			oldPass,
			function(user) {
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
			errCb
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
