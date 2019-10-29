const Phone = require("../models/Phone");
const Messages = require("../constants/Messages");

class SmsService {
	static sendValidationCode(phoneNumber, code, cb, errCb) {
		const data = {
			from: Messages.SMS.VALIDATION.FROM,
			to: phoneNumber,
			subject: Messages.SMS.VALIDATION.SUBJECT,
			text: Messages.SMS.VALIDATION.MESSAGE(code)
		};

		// TODO send sms
		return cb();
	}

	static create(phoneNumber, code, did, cb, errCb) {
		Phone.generate(
			phoneNumber,
			code,
			did,
			function(mail) {
				if (!mail) return errCb(Messages.SMS.ERR.CREATE);
				return cb(mail);
			},
			function(err) {
				console.log(err);
				return errCb(Messages.SMS.ERR.COMMUNICATION_ERROR);
			}
		);
	}

	static validatePhone(did, code, cb, errCb) {
		Phone.get(
			did,
			function(phone) {
				if (!phone) return errCb(Messages.SMS.ERR.GET);

				phone.validatePhone(
					code,
					function(phone) {
						if (!phone) return errCb(Messages.SMS.ERR.NO_SMSCODE_MATCH);
						return cb(phone);
					},
					function(err) {
						console.log(err);
						return errCb(Messages.SMS.ERR.COMMUNICATION_ERROR);
					}
				);
			},
			function(err) {
				console.log(err);
				return errCb(Messages.SMS.ERR.COMMUNICATION_ERROR);
			}
		);
	}

	static isValidated(did, cb, errCb) {
		Phone.getValidated(
			did,
			function(phone) {
				if (!phone) return errCb(Messages.SMS.ERR.GET);
				return cb(phone.validated);
			},
			function(err) {
				console.log(err);
				return errCb(Messages.SMS.ERR.COMMUNICATION_ERROR);
			}
		);
	}
}

module.exports = SmsService;
