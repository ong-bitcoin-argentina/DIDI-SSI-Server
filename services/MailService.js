const Mail = require("../models/Mail");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const mailgun = require("mailgun-js")({ apiKey: Constants.MAILGUN_API_KEY, domain: Constants.MAILGUN_DOMAIN });

class MailService {
	static sendValidationCode(eMail, code, cb, errCb) {
		const data = {
			from: Messages.EMAIL.VALIDATION.FROM,
			to: eMail,
			subject: Messages.EMAIL.VALIDATION.SUBJECT,
			text: Messages.EMAIL.VALIDATION.MESSAGE(code)
		};

		mailgun.messages().send(data, (error, res) => {
			if (Constants.DEBUGG) console.log(Messages.EMAIL.SENT);

			if (error) {
				console.log(error);
				return errCb(error);
			}
			return cb(res);
		});
	}

	static create(email, code, did, cb, errCb) {
		Mail.generate(
			email,
			code,
			did,
			function(mail) {
				if (!mail) return errCb(Messages.EMAIL.ERR.CREATE);
				return cb(mail);
			},
			function(err) {
				console.log(err);
				return errCb(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
			}
		);
	}

	static validateMail(did, code, cb, errCb) {
		Mail.get(
			did,
			function(mail) {
				if (!mail) return errCb(Messages.EMAIL.ERR.GET);

				mail.validateMail(
					code,
					function(mail) {
						if (!mail) return errCb(Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
						return cb(mail);
					},
					function(err) {
						console.log(err);
						return errCb(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
					}
				);
			},
			function(err) {
				console.log(err);
				return errCb(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
			}
		);
	}
}

module.exports = MailService;
