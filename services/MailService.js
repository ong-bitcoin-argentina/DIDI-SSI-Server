const Mail = require("../models/Mail");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

const mailgun = 
   Constants.MAILGUN_API_KEY ?
	  require("mailgun-js")({ 
		  apiKey: Constants.MAILGUN_API_KEY, domain: Constants.MAILGUN_DOMAIN
	  }) : null;

/**
 * Obtiene el pedido de validación a partir del mail
 */
const getByMail = async function(email) {
	try {
		const mail = await Mail.getByEmail(email);
		if (!mail) return Promise.reject(Messages.EMAIL.ERR.NO_VALIDATIONS_FOR_EMAIL);
		if (mail.expired()) return Promise.reject(Messages.EMAIL.ERR.VALIDATION_EXPIRED);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

module.exports.getByMail = getByMail;

/**
 * Realiza el envío de mail con el código de validación usando "Mailgun"
 */ 
module.exports.sendValidationCode = async function(eMail, code) {
	const data = {
		from: Messages.EMAIL.VALIDATION.FROM,
		to: eMail,
		subject: Messages.EMAIL.VALIDATION.SUBJECT,
		text: Messages.EMAIL.VALIDATION.MESSAGE(code)
	};

	// Imprimir código por pantalla sin enviar mail si se seteo "NO_EMAILS"
	if (Constants.NO_EMAILS) return Promise.resolve(code);

	// En caso cotrario enviar un sms
	try {
		const result = await mailgun.messages().send(data);
		if (Constants.DEBUGG) console.log(Messages.EMAIL.SENT);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.EMAIL_SEND_ERROR);
	}
};

/**
 *  Crear y guardar pedido de validación de mail
 */ 
module.exports.create = async function(email, code, did) {
	try {
		let mail = await Mail.generate(email, code, did);
		if (!mail) return Promise.reject(Messages.EMAIL.ERR.CREATE);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

/**
 *  Valida email según el did
 */ 
module.exports.validateMail = async function(mail, did) {
	try {
		// Validar mail
		mail = await mail.validateMail(did);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

/**
 *  Obtiene y verifica que el código de validación sea correcto
 */ 
module.exports.isValid = async function(email, code) {
	try {
		let mail = await getByMail(email);
		let valid = await mail.isValid(code);
		if (!valid) return Promise.reject(Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

/**
 *  Indica si un mail a sido validado según el did
 */ 
module.exports.isValidated = async function(did, email) {
	try {
		let isValidated = await Mail.isValidated(did, email);
		return Promise.resolve(isValidated);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};
