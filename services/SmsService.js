const Phone = require("../models/Phone");

const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

const twilio = require("twilio");

module.exports.sendValidationCode = async function(phoneNumber, code) {
	const data = {
		body: Messages.SMS.VALIDATION.MESSAGE(code),
		to: Constants.PHONE_REGION + phoneNumber.substring(phoneNumber.length - 8),
		from: Constants.TWILIO_PHONE_NUMBER
	};

	var client = twilio(Constants.TWILIO_SID, Constants.TWILIO_TOKEN);
	if (Constants.DEBUGG) console.log(Messages.SMS.SENDING(data.to));
	client.messages.create(data, function(err, _) {
		if (err) return Promise.reject(err);
		if (Constants.DEBUGG) console.log(Messages.SMS.SENT);
	});
};

module.exports.create = async function(phoneNumber, code, did) {
	try {
		let phone = await Phone.generate(phoneNumber, code, did);
		if (!phone) return Promise.reject(Messages.SMS.ERR.CREATE);
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.SMS.ERR.COMMUNICATION_ERROR);
	}
};

module.exports.validatePhone = async function(did, code) {
	let phone;
	try {
		phone = await Phone.get(did);
		if (!phone) return Promise.reject(Messages.SMS.ERR.NO_VALIDATIONS_FOR_NUMBER);
		if (phone.expired()) return Promise.reject(Messages.SMS.ERR.VALIDATION_EXPIRED);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.EMAIL.ERR.COMMUNICATION_ERROR);
	}

	try {
		phone = await phone.validatePhone(code);
		if (!phone) return Promise.reject(Messages.SMS.ERR.NO_SMSCODE_MATCH);
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.SMS.ERR.COMMUNICATION_ERROR);
	}
};
