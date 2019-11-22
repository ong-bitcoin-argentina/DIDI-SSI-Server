const Mail = require("../models/Mail");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const mailgun = require("mailgun-js")({ apiKey: Constants.MAILGUN_API_KEY, domain: Constants.MAILGUN_DOMAIN });

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

// validar codigo y actualizar pedido de validacion de mail
module.exports.validateMail = async function(email, code, did) {
	let mail;
	try {
		// obtener pedido de validaciòn
		mail = await Mail.getByEmail(email);
		if (!mail) return Promise.reject(Messages.EMAIL.ERR.NO_VALIDATIONS_FOR_EMAIL);
		if (mail.expired()) return Promise.reject(Messages.EMAIL.ERR.VALIDATION_EXPIRED);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}

	try {
		// validar mail
		mail = await mail.validateMail(code, did);
		if (!mail) return Promise.reject(Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
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
