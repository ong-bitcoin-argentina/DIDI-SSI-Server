const User = require("../models/User");
const Messages = require("../constants/Messages");
const PhoneNormalization = require("./utils/PhoneNormalization");
const fs = require("fs");
const Image = require("../models/Image");
const sanitize = require("mongo-sanitize");

const { DID_NOT_FOUND } = Messages.VALIDATION;

/**
 * Obtener usuario a partir de un did
 */
let getByDID = async function (did) {
	try {
		let user = await User.getByDID(did);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};
module.exports.getByDID = getByDID;

/**
 * Creado porque getByDID no retorna error en caso de no existir
 * (puede que algun endpoint este esperando ese resultado)
 */
const findByDid = async did => {
	const user = await User.getByDID(did);
	if (!user) throw DID_NOT_FOUND(did);
	return user;
};
module.exports.findByDid = findByDid;

/**
 * Obtener usuario a partir de un did y actualizar su información
 */
const findByDidAndUpdate = async (did, data) => {
	const user = await User.findByDidAndUpdate(did, data);
	if (!user) throw DID_NOT_FOUND(did);
	return user;
};
module.exports.findByDidAndUpdate = findByDidAndUpdate;

/**
 * Obtener usuario a partir de un mail
 */
let getByEmail = async function (email) {
	try {
		let user = await User.getByEmail(email);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};
module.exports.getByEmail = getByEmail;

/*
 * Obtener usuario a partir un número de teléfono
 */
let getByTel = async function (phoneNumber) {
	try {
		let user = await User.getByTel(phoneNumber);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};
module.exports.getByTel = getByTel;

/**
 * Obtener usuario y validar contraseña
 */
let getAndValidate = async function (did, pass, email) {
	try {
		// Obtener usuario
		let user = await getByDID(did);
		if (!user) {
			if (email) user = await getByEmail(email);
			if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_DID);
		}

		// Validar contraseña
		let match = await user.compareField("password", pass);
		if (!match) return Promise.reject(Messages.USER.ERR.INVALID_USER);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.INVALID_USER);
	}
};
module.exports.getAndValidate = getAndValidate;

/**
 * Dado un email, verifica si este esta en uso
 */
let emailTaken = async function (mail, exceptionDid) {
	try {
		const taken = await User.emailTaken(mail, exceptionDid);
		if (taken) return Promise.reject(Messages.USER.ERR.EMAIL_TAKEN);
		return Promise.resolve();
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.VALIDATE);
	}
};
module.exports.emailTaken = emailTaken;

/**
 * Verifica si un númer de teléfono ya esta en uso
 */
let telTaken = async function (tel, exceptionDid) {
	try {
		const taken = await User.telTaken(tel, exceptionDid);
		if (taken) return Promise.reject(Messages.USER.ERR.TEL_TAKEN);
		return;
	} catch (err) {
		console.log(err);
		throw Messages.USER.VALIDATE;
	}
};
module.exports.telTaken = telTaken;

/**
 * Crear un usuario, siempre que este no exista uno asociado al did
 */
module.exports.create = async function (
	did,
	privateKeySeed,
	userMail,
	phoneNumber,
	userPass,
	firebaseId,
	name,
	lastname
) {
	try {
		// Verificar si ya existe un usuario asociado a ese did
		let user = await getByDID(did);
		if (user) return Promise.reject(Messages.USER.ERR.USER_ALREADY_EXIST);

		// Crear usuario
		user = await User.generate(did, privateKeySeed, userMail, phoneNumber, userPass, firebaseId, name, lastname);
		if (!user) return Promise.reject(Messages.USER.ERR.CREATE);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

/**
 *  Validar contraseña
 */
module.exports.login = async function (did, email, pass) {
	let user;
	try {
		user = await getAndValidate(did, pass, email);

		const sameEmail = await user.compareField("mail", email);
		if (sameEmail === false) return Promise.reject(Messages.USER.ERR.INVALID_LOGIN);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.INVALID_LOGIN);
	}
};

/**
 *  Retorna la clave privada de didi
 */
module.exports.recoverAccount = async function (mail, pass, firebaseId) {
	let user;
	try {
		// Buscar usuario asociado al mail
		user = await User.getByEmail(mail);

		if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_EMAIL);

		// Validar contraseña
		const isMatch = await user.compareField("password", pass);
		if (!isMatch) return Promise.reject(Messages.USER.ERR.INVALID_USER);

		await user.updateFirebaseId(firebaseId);

		// Retornar clave privada
		return Promise.resolve(user.getSeed());
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

/**
 *  Obtener usuario y actualizar su mail
 */
module.exports.changeEmail = async function (did, newMail, password) {
	try {
		// Obtener usuario
		let user = await getByDID(did);
		if (!user) return Promise.reject(Messages.USER.ERR.GET);

		// Validar contraseña
		const isMatch = await user.compareField("password", password);
		if (!isMatch) return Promise.reject(Messages.USER.ERR.INVALID_USER);

		// Actualizar mail
		user = await user.updateEmail(newMail);

		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

/**
 *  Obtener usuario y actualizar su número de teléfono
 */
module.exports.changePhoneNumber = async function (did, newPhoneNumber, password, firebaseId) {
	try {
		// Obtener usuario
		let user = await getByDID(did);
		if (!user) return Promise.reject(Messages.USER.ERR.GET);

		// Validar contraseña
		const isMatch = await user.compareField("password", password);
		if (!isMatch) return Promise.reject(Messages.USER.ERR.INVALID_USER);

		// Actualizar tel
		user = await user.updatePhoneNumber(newPhoneNumber, firebaseId);

		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

/**
 *  Crear nueva contraseña, siempre que sea valida la contraseña anterior
 */
module.exports.changePassword = async function (did, oldPass, newPass) {
	let user;
	try {
		// Obtener usuario y validar contraseña anterior
		user = await getAndValidate(did, oldPass);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	try {
		// Actualizar contaraseña
		user = await user.updatePassword(newPass);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

/**
 *  Recuperar contraseña en caso de olvido
 */
module.exports.recoverPassword = async function (eMail, newPass) {
	try {
		// Obtener información usuario
		let user = await getByEmail(eMail);
		if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_EMAIL);

		// Actualizar contaraseña
		user = await user.updatePassword(newPass);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.UPDATE);
	}
};

/**
 *  Normalización del número de teléfono
 */
module.exports.normalizePhone = async function (phone) {
	const user = await getByTel(phone);
	return user ? phone : PhoneNormalization.normalizePhone(phone);
};

/**
 *  Obtener usuario y actualizar imagen
 */
module.exports.saveImage = async function (did, contentType, path) {
	try {
		// Obtener información de usuario
		let user = await getByDID(did);
		if (!user) return Promise.reject(Messages.USER.ERR.GET);

		// Crear imagen
		const cleanedPath = sanitize(path);
		const image = fs.readFileSync(cleanedPath);
		const encode_image = image.toString("base64");
		const buffer = Buffer.from(encode_image, "base64");

		const { _id } = await Image.generate(buffer, contentType);

		// Actualizar imagen del usuario
		await user.updateImage(_id);

		return Promise.resolve(_id);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.IMAGE.ERR.CREATE);
	}
};

/**
 *  Obtener imagen de usuario según un id
 */
module.exports.getImage = async function (id) {
	try {
		const image = await Image.getById(id);
		if (!image) return Promise.reject(Messages.IMAGE.ERR.GET);
		return Promise.resolve(image);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.IMAGE.ERR.GET);
	}
};
