const ResponseHandler = require('../../utils/ResponseHandler');
const MailService = require('../../services/MailService');
const UserService = require('../../services/UserService');
const CodeGenerator = require('../../utils/CodeGenerator');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const createMailVerification = async (req, res) => {
  const eMail = req.body.eMail.toLowerCase();
  const { did } = req.body;
  const { password } = req.body;
  const { unique } = req.body;
  try {
    // Validar que el mail no este en uso
    if (unique) await UserService.emailTaken(eMail, did);
    // Si se ingresó contraseña, validarla
    if (did && password) await UserService.getAndValidate(did, password);
    // Generar código de validación
    const code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
    // eslint-disable-next-line no-console
    if (Constants.DEBUGG) console.log(code);
    // Crear y guardar pedido de validación de mail
    await MailService.create(eMail, code, undefined);
    // Mandar mail con el código de validación
    await MailService.sendValidationCode(eMail, code);
    return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createMailVerification,
};
