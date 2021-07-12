const ResponseHandler = require('../../utils/ResponseHandler');
const SmsService = require('../../services/SmsService');
const UserService = require('../../services/UserService');
const CodeGenerator = require('../../utils/CodeGenerator');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const createSmsValidation = async (req, res) => {
  const { did } = req.body;
  const { password } = req.body;
  const { unique } = req.body;

  try {
    const phoneNumber = await UserService.normalizePhone(req.body.cellPhoneNumber);
    // Validar que el teléfono no esté en uso
    if (unique) await UserService.telTaken(phoneNumber, did);

    // Si se ingresó contraseña, validarla
    if (password && did) await UserService.getAndValidate(did, password);

    // Generar código de validación
    const code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
    // eslint-disable-next-line no-console
    if (Constants.DEBUGG) console.log(code);

    // Crear y guardar pedido de validación de teléfono
    await SmsService.create(phoneNumber, code, undefined);

    // Mandar sms con el código de validacion
    if (Constants.NO_SMS) {
      return ResponseHandler.sendRes(res, { code });
    }

    await SmsService.sendValidationCode(phoneNumber, code);

    return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.SENT);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createSmsValidation,
};
