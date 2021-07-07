/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const Certificate = require('../../models/Certificate');
const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');
const SmsService = require('../../services/SmsService');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const updatePhoneNumber = async (req, res) => {
  const { did } = req.body;
  const { phoneValidationCode } = req.body;
  const { password } = req.body;
  const firebaseId = req.body.firebaseId ? req.body.firebaseId : '';

  try {
    const newPhoneNumber = await UserService.normalizePhone(req.body.newPhoneNumber);
    // Validar telefono nuevo en uso
    await UserService.telTaken(newPhoneNumber, did);

    // Validar codigo
    const phone = await SmsService.isValid(newPhoneNumber, phoneValidationCode);

    // Generar certificado validando que ese did le corresponde al dueño del teléfono
    const cert = await CertService.createPhoneCertificate(did, newPhoneNumber);
    await CertService.verifyCertificatePhoneNumber(cert);

    // Revocar certificado anterior
    const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.TEL);
    for (const elem of old) {
      elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
      const jwt = await elem.getJwt();
      await MouroService.revokeCertificate(jwt, elem.hash, did);
    }

    // mandar certificado a mouro
    const jwt = await MouroService.saveCertificate(cert, did);

    // Actualizar numero de teléfono
    await UserService.changePhoneNumber(did, newPhoneNumber, password, firebaseId);

    // Validar código y actualizar pedido de validación de mail
    await Certificate.generate(
      Constants.CERTIFICATE_NAMES.TEL,
      did,
      Constants.CERTIFICATE_STATUS.UNVERIFIED,
      jwt.data,
      jwt.hash,
    );
    await SmsService.validatePhone(phone, did);
    return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PHONE(cert));
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updatePhoneNumber,
};
