const twilio = require('twilio');
const Phone = require('../models/Phone');

const Messages = require('../constants/Messages');
const Constants = require('../constants/Constants');

const {
  missingDid, missingPhoneNumber, missingCode,
} = require('../constants/serviceErrors');

/**
 *  Obtiene el pedido de validación a partir del número de teléfono
 */
const getByPhoneNumber = async function getByPhoneNumber(phoneNumber) {
  if (!phoneNumber) throw missingPhoneNumber;
  try {
    const phone = await Phone.getByPhoneNumber(phoneNumber);
    if (!phone) return Promise.reject(Messages.SMS.ERR.NO_VALIDATIONS_FOR_NUMBER);
    if (phone.expired()) return Promise.reject(Messages.SMS.ERR.VALIDATION_EXPIRED);
    return Promise.resolve(phone);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};
module.exports.getByPhoneNumber = getByPhoneNumber;

/**
 *  Realiza el envío de sms con el código de validación usando "Twillio"
 */
module.exports.sendValidationCode = async function sendValidationCode(phoneNumber, code) {
  if (!phoneNumber) throw missingPhoneNumber;
  if (!code) throw missingCode;
  const data = {
    body: Messages.SMS.VALIDATION.MESSAGE(code),
    to: phoneNumber,
    from: Constants.TWILIO_PHONE_NUMBER,
  };

  // En caso de "NO_SMS", finaliza
  if (Constants.NO_SMS) return Promise.resolve(code);

  // En caso cotrario enviar sms
  const client = twilio(Constants.TWILIO_SID, Constants.TWILIO_TOKEN);
  // eslint-disable-next-line no-console
  if (Constants.DEBUGG) console.log(Messages.SMS.SENDING(data.to));

  try {
    const result = await client.messages.create(data);
    // eslint-disable-next-line no-console
    if (Constants.DEBUGG) console.log(Messages.SMS.SENT);
    return Promise.resolve(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.SMS.ERR.SMS_SEND_ERROR);
  }
};

/**
 *  Crear y guardar pedido de validación del número de teléfono
 */
module.exports.create = async function create(phoneNumber, code, did) {
  if (!phoneNumber) throw missingPhoneNumber;
  if (!code) throw missingCode;
  try {
    const phone = await Phone.generate(phoneNumber, code, did);
    if (Constants.DEBUGG) return Promise.resolve(phone);
    if (!phone) return Promise.reject(Messages.SMS.ERR.CREATE);
    return Promise.resolve(phone);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 *  Valida número de teléfono según el did
 */
module.exports.validatePhone = async function validatePhone(phone, did) {
  if (!phone) throw missingPhoneNumber;
  if (!did) throw missingDid;
  try {
    // validar tel
    const validatedPhone = await phone.validatePhone(did);
    return Promise.resolve(validatedPhone);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 *  Obtiene y compara el código de validación
 */
module.exports.isValid = async function isValid(phoneNumber, code) {
  if (!phoneNumber) throw missingPhoneNumber;
  if (!code) throw missingCode;
  try {
    const phone = await getByPhoneNumber(phoneNumber);
    const valid = await phone.isValid(code);
    if (!valid) return Promise.reject(Messages.SMS.ERR.NO_SMSCODE_MATCH);
    return Promise.resolve(phone);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 *  Indica si un número de teléfono a sido validado según el did
 */
module.exports.isValidated = async function isValidated(did, phoneNumber) {
  if (!did) throw missingDid;
  if (!phoneNumber) throw missingPhoneNumber;
  try {
    const isValid = await Phone.isValidated(did, phoneNumber);
    return Promise.resolve(isValid);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};
