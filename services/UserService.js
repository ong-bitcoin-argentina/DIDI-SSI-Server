const User = require("../models/User");
const Messages = require("../constants/Messages");

let _getAndValidate = async function(did, pass) {
	let user;
	try {
		user = await User.getByDID(did);
		if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_DID);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.COMMUNICATION_ERROR);
	}

	try {
		let match = await user.comparePassword(pass);
		if (!match) return Promise.reject(Messages.USER.ERR.INVALID_USER);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.INVALID_USER);
	}
};

module.exports.create = async function(did, privateKeySeed, userMail, phoneNumber, userPass) {
	try {
		let user = await User.getByDID(did);
		if (user) return Promise.reject(Messages.USER.ERR.USER_ALREADY_EXIST);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.COMMUNICATION_ERROR);
	}

	try {
		let user = await User.generate(did, privateKeySeed, userMail, phoneNumber, userPass);
		if (!user) return Promise.reject(Messages.USER.ERR.CREATE);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.COMMUNICATION_ERROR);
	}
};

module.exports.login = async function(did, pass) {
	let user;
	try {
		user = await _getAndValidate(did, pass);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

module.exports.recoverAccount = async function(mail, pass) {
	let user;
	try {
		user = await User.getByEmail(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.COMMUNICATION_ERROR);
	}

	if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_EMAIL);

	try {
		const isMatch = await user.comparePassword(pass);
		if (!isMatch) return Promise.reject(Messages.USER.ERR.INVALID_USER);
		return Promise.resolve(user.seed);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.INVALID_USER);
	}
};

module.exports.changeEmail = async function(did, password, newMail) {
	let user;
	try {
		user = await _getAndValidate(did, password);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
	
	try {
		user = await user.updateEmail(newMail);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

module.exports.changePhoneNumber = async function(did, password, newPhoneNumber) {
	let user;
	try {
		user = await _getAndValidate(did, password);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	try {
		user = await user.updatePhoneNumber(newPhoneNumber);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

module.exports.changePassword = async function(did, oldPass, newPass) {
	let user;
	try {
		user = await _getAndValidate(did, oldPass);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	try {
		user = await user.updatePassword(newPass);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

module.exports.recoverPassword = async function(did, newPass) {
	let user;
	try {
		user = await User.getByDID(did);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.COMMUNICATION_ERROR);
	}

	if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_DID);

	try {
		user = await user.updatePassword(newPass);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};
