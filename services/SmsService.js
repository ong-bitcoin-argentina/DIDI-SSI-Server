const Phone = require("../models/Phone");

const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

const twilio = require("twilio");

/**
 *  Obtiene el pedido de validación a partir del número de teléfono
 */
let getByPhoneNumber = async function(phoneNumber) {
	try {
		const phone = await Phone.getByPhoneNumber(phoneNumber);
		if (!phone) return Promise.reject(Messages.SMS.ERR.NO_VALIDATIONS_FOR_NUMBER);
		if (phone.expired()) return Promise.reject(Messages.SMS.ERR.VALIDATION_EXPIRED);
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};
module.exports.getByPhoneNumber = getByPhoneNumber;

/**
 *  Realiza el envío de sms con el código de validación usando "Twillio"
 */
module.exports.sendValidationCode = async function(phoneNumber, code) {
	const data = {
		body: Messages.SMS.VALIDATION.MESSAGE(code),
		to: phoneNumber,
		from: Constants.TWILIO_PHONE_NUMBER
	};

	// En caso de "NO_SMS", imprimir codigo por pantalla sin enviar sms
	if (Constants.NO_SMS) return Promise.resolve(code);

	// En caso cotrario enviar sms
	var client = twilio(Constants.TWILIO_SID, Constants.TWILIO_TOKEN);
	if (Constants.DEBUGG) console.log(Messages.SMS.SENDING(data.to));

	try {
		const result = await client.messages.create(data);
		if (Constants.DEBUGG) console.log(Messages.SMS.SENT);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.SMS.ERR.SMS_SEND_ERROR);
	}
};

/**
 *  Crear y guardar pedido de validación del número de teléfono
 */
module.exports.create = async function(phoneNumber, code, did) {
	try {
		let phone = await Phone.generate(phoneNumber, code, did);
		if (Constants.DEBUGG) return Promise.resolve(phone);
		if (!phone) return Promise.reject(Messages.SMS.ERR.CREATE);
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

/**
 *  Valida número de teléfono según el did
 */
module.exports.validatePhone = async function(phone, did) {
	try {
		// validar tel
		phone = await phone.validatePhone(did);
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

/**
 *  Obtiene y compara el código de validación
 */
module.exports.isValid = async function(phoneNumber, code) {
	try {
		let phone = await getByPhoneNumber(phoneNumber);
		let valid = await phone.isValid(code);
		if (!valid) return Promise.reject(Messages.SMS.ERR.NO_SMSCODE_MATCH);
		return Promise.resolve(phone);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};

/**
 *  Indica si un número de teléfono a sido validado según el did
 */ 
module.exports.isValidated = async function(did, phoneNumber) {
	try {
		let isValidated = await Phone.isValidated(did, phoneNumber);
		return Promise.resolve(isValidated);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};
