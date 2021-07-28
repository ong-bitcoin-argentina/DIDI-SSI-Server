/* eslint-disable no-console */
const Mail = require('../models/Mail');
const Messages = require('../constants/Messages');
const Constants = require('../constants/Constants');

const { missingEmail, missingCode, missingDid } = require('../constants/serviceErrors');

const mailgun = Constants.MAILGUN_API_KEY
  // eslint-disable-next-line import/order
  ? require('mailgun-js')({
    apiKey: Constants.MAILGUN_API_KEY, domain: Constants.MAILGUN_DOMAIN,
  }) : null;

/**
 * Obtiene el pedido de validación a partir del mail
 */
const getByMail = async function getByMail(email) {
  if (!email) throw missingEmail;
  try {
    const mail = await Mail.getByEmail(email);
    if (!mail) return Promise.reject(Messages.EMAIL.ERR.NO_VALIDATIONS_FOR_EMAIL);
    if (mail.expired()) return Promise.reject(Messages.EMAIL.ERR.VALIDATION_EXPIRED);
    return Promise.resolve(mail);
  } catch (err) {
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 * Realiza el envío de mail con el código de validación usando "Mailgun"
 */
const sendValidationCode = async function sendValidationCode(eMail, code) {
  if (!eMail) throw missingEmail;
  if (!code) throw missingCode;
  const data = {
    from: Messages.EMAIL.VALIDATION.FROM,
    to: eMail,
    subject: Messages.EMAIL.VALIDATION.SUBJECT,
    text: Messages.EMAIL.VALIDATION.MESSAGE(code),
  };

  // En caso de seteo en "NO_EMAILS", finaliza
  if (Constants.NO_EMAILS) return Promise.resolve(code);

  // En caso cotrario enviar un sms
  try {
    const result = await mailgun.messages().send(data);

    if (Constants.DEBUGG) console.log(Messages.EMAIL.SENT);
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(Messages.EMAIL.ERR.EMAIL_SEND_ERROR);
  }
};

/**
 *  Crear y guardar pedido de validación de mail
 */
const create = async function create(email, code, did) {
  if (!email) throw missingEmail;
  if (!code) throw missingCode;
  try {
    const mail = await Mail.generate(email, code, did);
    if (!mail) return Promise.reject(Messages.EMAIL.ERR.CREATE);
    return Promise.resolve(mail);
  } catch (err) {
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 *  Valida email según el did
 */
const validateMail = async function validateMail(mail, did) {
  if (!mail) throw missingEmail;
  if (!did) throw missingDid;
  try {
    // Validar mail
    const validatedMail = await mail.validateMail(did);
    return Promise.resolve(validatedMail);
  } catch (err) {
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 *  Obtiene y verifica que el código de validación sea correcto
 */
const isValid = async function isValid(email, code) {
  if (!email) throw missingEmail;
  if (!code) throw missingCode;
  try {
    const mail = await getByMail(email);
    const valid = await mail.isValid(code);
    if (!valid) return Promise.reject(Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
    return Promise.resolve(mail);
  } catch (err) {
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 *  Indica si un mail a sido validado según el did
 */
const isValidated = async function isValidated(did, email) {
  if (!did) throw missingDid;
  if (!email) throw missingEmail;
  try {
    const validated = await Mail.isValidated(did, email);
    return Promise.resolve(validated);
  } catch (err) {
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

module.exports = {
  getByMail,
  sendValidationCode,
  create,
  validateMail,
  isValid,
  isValidated,
};
