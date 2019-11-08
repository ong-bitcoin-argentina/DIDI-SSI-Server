const User = require("../models/User");
const Messages = require("../constants/Messages");

// obtener usuario
let getByDID = async function(did) {
	try {
		let user = await User.getByDID(did);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.COMMUNICATION_ERROR);
	}
};
module.exports.getByDID = getByDID;

// obtener usuario y validar contraseña
let getAndValidate = async function(did, pass) {
	try {
		// obtener usuario
		let user = await getByDID(did);
		if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_DID);

		// validar contraseña
		let match = await user.comparePassword(pass);
		if (!match) return Promise.reject(Messages.USER.ERR.INVALID_USER);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.INVALID_USER);
	}
};
module.exports.getAndValidate = getAndValidate;

// crear un usuario, siempre que este no exista uno asociado al did
module.exports.create = async function(did, privateKeySeed, userMail, phoneNumber, userPass) {
	try {
		// validar si ya existe un usuario asociado a ese did
		let user = await getByDID(did);
		if (user) return Promise.reject(Messages.USER.ERR.USER_ALREADY_EXIST);

		// crear usuario
		user = await User.generate(did, privateKeySeed, userMail, phoneNumber, userPass);
		if (!user) return Promise.reject(Messages.USER.ERR.CREATE);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.COMMUNICATION_ERROR);
	}
};

// validar contraseña
module.exports.login = async function(did, pass) {
	let user;
	try {
		user = await getAndValidate(did, pass);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// retorna la clave privada de didi
module.exports.recoverAccount = async function(mail, pass) {
	let user;
	try {
		// buscar usuario asociado al mail
		user = await User.getByEmail(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.COMMUNICATION_ERROR);
	}

	if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_EMAIL);

	try {
		// validar contraseña
		const isMatch = await user.comparePassword(pass);
		if (!isMatch) return Promise.reject(Messages.USER.ERR.INVALID_USER);

		// retornar clave privada
		return Promise.resolve(user.seed);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.INVALID_USER);
	}
};

// obtener usuario y actualizar mail
module.exports.changeEmail = async function(did, newMail) {
	try {
		// obtener usuario
		let user = await getByDID(did);
		if (!user) return Promise.reject(Messages.USER.ERR.GET);

		// actualizar mail
		user = await user.updateEmail(newMail);

		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

// obtener usuario y actualizar tel
module.exports.changePhoneNumber = async function(did, newPhoneNumber) {
	try {
		// obtener usuario
		let user = await getByDID(did);
		if (!user) return Promise.reject(Messages.USER.ERR.GET);

		// actualizar tel
		user = await user.updatePhoneNumber(newPhoneNumber);

		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

// cambiar contraseña a partir de la vieja contraseña
module.exports.changePassword = async function(did, oldPass, newPass) {
	let user;
	try {
		// obtener usuario y validar contraseña
		user = await getAndValidate(did, oldPass);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	try {
		// actualizar contaraseña
		user = await user.updatePassword(newPass);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

// cambiar contraseña
module.exports.recoverPassword = async function(did, newPass) {
	try {
		// obtener usuario
		let user = await getByDID(did);
		if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_DID);

		// actualizar contaraseña
		user = await user.updatePassword(newPass);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};
