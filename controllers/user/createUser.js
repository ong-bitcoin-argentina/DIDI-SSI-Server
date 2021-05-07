const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');
const MailService = require('../../services/MailService');
const SmsService = require('../../services/SmsService');
const Messages = require('../../constants/Messages');

const createUser = async (req, res) => {
  const {
    password, did, privateKeySeed, name, lastname,
  } = req.body;
  const phoneNumber = await UserService.normalizePhone(req.body.phoneNumber);
  const eMail = req.body.eMail.toLowerCase();
  const firebaseId = req.body.firebaseId ? req.body.firebaseId : '';

  try {
    await UserService.emailTaken(eMail);
    await UserService.telTaken(phoneNumber);

    // Verificar que el mail haya sido validado
    const mailValidated = await MailService.isValidated(did, eMail);
    if (!mailValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.MAIL_NOT_VALIDATED);

    // Verificar que el teléfono haya sido validado
    const phoneValidated = await SmsService.isValidated(did, phoneNumber);
    if (!phoneValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.PHONE_NOT_VALIDATED);

    // Crear usuario
    await UserService.create(
      did,
      privateKeySeed,
      eMail,
      phoneNumber,
      password,
      firebaseId,
      name,
      lastname,
    );

    return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.REGISTERED);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createUser,
};
