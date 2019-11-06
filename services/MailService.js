const Mail = require("../models/Mail");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const mailgun = require("mailgun-js")({ apiKey: Constants.MAILGUN_API_KEY, domain: Constants.MAILGUN_DOMAIN });

module.exports.sendValidationCode = async function(eMail, code) {
	const data = {
		from: Messages.EMAIL.VALIDATION.FROM,
		to: eMail,
		subject: Messages.EMAIL.VALIDATION.SUBJECT,
		text: Messages.EMAIL.VALIDATION.MESSAGE(code)
	};

	try {
		await mailgun.messages().send(data);
		if (Constants.DEBUGG) console.log(Messages.EMAIL.SENT);
	} catch (err) {
		console.log(err);
	}
};

module.exports.create = async function(email, code, did) {
	try {
		let mail = await Mail.generate(email, code, did);
		if (!mail) return Promise.reject(Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}
};

module.exports.validateMail = async function(did, code) {
	let mail;
	try {
		mail = await Mail.get(did);
		if (!mail) return Promise.reject(Messages.EMAIL.ERR.NO_VALIDATIONS_FOR_EMAIL);
		if (mail.expired()) return Promise.reject(Messages.EMAIL.ERR.VALIDATION_EXPIRED);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}

	try {
		mail = await mail.validateMail(code);
		if (!mail) return Promise.reject(Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
		return Promise.resolve(mail);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}
};

module.exports.isValidated = async function(did, email) {
	try {
		let isValidated = await Mail.isValidated(did, email);
		return Promise.resolve(isValidated);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.SMS.ERR.COMMUNICATION_ERROR);
	}
};
