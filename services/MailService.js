const Mail = require("../models/Mail");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const mailgun = require("mailgun-js")({ apiKey: Constants.MAILGUN_API_KEY, domain: Constants.MAILGUN_DOMAIN });

// obtiene el pedido de validacion a partir del mail
let getByMail = async function(email) {
	try {
		const mail = await Mail.getByEmail(email);
		if (!mail) return Promise.reject(Messages.EMAIL.ERR.NO_VALIDATIONS_FOR_EMAIL);
		if (mail.expired()) return Promise.reject(Messages.EMAIL.ERR.VALIDATION_EXPIRED);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}
};
module.exports.getByMail = getByMail;

// realiza el envio de mail con el còdigo de validaciòn usando "Mailgun"
module.exports.sendValidationCode = async function(eMail, code) {
	const data = {
		from: Messages.EMAIL.VALIDATION.FROM,
		to: eMail,
		subject: Messages.EMAIL.VALIDATION.SUBJECT,
		text: Messages.EMAIL.VALIDATION.MESSAGE(code)
	};

	try {
		const result = await mailgun.messages().send(data);
		if (Constants.DEBUGG) console.log(Messages.EMAIL.SENT);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.EMAIL_SEND_ERROR);
	}
};

// crear y guardar pedido de validacion de mail
module.exports.create = async function(email, code, did) {
	try {
		let mail = await Mail.generate(email, code, did);
		if (!mail) return Promise.reject(Messages.EMAIL.ERR.CREATE);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}
};

// marca el pedido como validado
module.exports.validateMail = async function(mail, did, jwt) {
	try {
		// validar mail
		mail = await mail.validateMail(did, jwt);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}
};

// obtiene y compara el codigo de validacion
module.exports.isValid = async function(email, code) {
	try {
		let mail = await getByMail(email);
		let valid = await mail.isValid(code);
		if (!valid) return Promise.reject(Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}
};

// indica si el pedido de validaciòn de mail fue validado
module.exports.isValidated = async function(did, email) {
	try {
		let isValidated = await Mail.isValidated(did, email);
		return Promise.resolve(isValidated);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.SMS.ERR.COMMUNICATION_ERROR);
	}
};
