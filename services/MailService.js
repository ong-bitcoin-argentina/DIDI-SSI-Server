const Mail = require("../models/Mail");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const mailgun = require("mailgun-js")({ apiKey: Constants.MAILGUN_API_KEY, domain: Constants.MAILGUN_DOMAIN });

module.exports.sendValidationCode = function(eMail, code) {
	const data = {
		from: Messages.EMAIL.VALIDATION.FROM,
		to: eMail,
		subject: Messages.EMAIL.VALIDATION.SUBJECT,
		text: Messages.EMAIL.VALIDATION.MESSAGE(code)
	};

	mailgun.messages().send(data, (error, _) => {
		if (Constants.DEBUGG) console.log(Messages.EMAIL.SENT);
		if (error) {
			console.log(error);
		}
	});
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
