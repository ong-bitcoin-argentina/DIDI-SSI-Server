const Phone = require("../models/Phone");

const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

const twilio = require("twilio");

class SmsService {
	static sendValidationCode(phoneNumber, code, cb, errCb) {
		const data = {
			body: Messages.SMS.VALIDATION.MESSAGE(code),
			to: Constants.PHONE_REGION + phoneNumber.substring(phoneNumber.length - 8),
			from: Constants.TWILIO_PHONE_NUMBER
		};

		var client = twilio(Constants.TWILIO_SID, Constants.TWILIO_TOKEN);
		if (Constants.DEBUGG) console.log(Messages.SMS.SENDING(data.to));
		client.messages.create(data, function(err, message) {
			if (err) return errCb(err);
			if (Constants.DEBUGG) console.log(Messages.SMS.SENT);
			return cb(message);
		});
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
				if (!phone) return errCb(Messages.SMS.ERR.NO_VALIDATIONS_FOR_NUMBER);

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
}

module.exports = SmsService;
