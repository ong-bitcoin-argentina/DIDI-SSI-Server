const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');
const MailService = require('../../services/MailService');
const Messages = require('../../constants/Messages');

const recoverPassword = async (req, res) => {
  const eMail = req.body.eMail.toLowerCase();
  const { eMailValidationCode } = req.body;
  const { newPass } = req.body;

  try {
    // Validar código
    let mail = await MailService.isValid(eMail, eMailValidationCode);
    if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);

    // Actualizar contraseña
    await UserService.recoverPassword(eMail, newPass);

    // Actualizar pedido de validación de mail
    // eslint-disable-next-line no-console
    console.log(await mail.getDid());
    mail = await MailService.validateMail(mail, await mail.getDid());

    return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  recoverPassword,
};
