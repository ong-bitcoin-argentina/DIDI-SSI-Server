/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const Certificate = require('../../models/Certificate');
const ResponseHandler = require('../../utils/ResponseHandler');
const SmsService = require('../../services/SmsService');
const UserService = require('../../services/UserService');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const createCertificateBySmsValidation = async (req, res) => {
  const { validationCode } = req.body;
  const { did } = req.body;

  try {
    const cellPhoneNumber = await UserService.normalizePhone(req.body.cellPhoneNumber);
    // Validar código
    const phone = await SmsService.isValid(cellPhoneNumber, validationCode);

    // Validar que no existe un usuario con ese nuemro de telefono
    const user = await UserService.getByTel(cellPhoneNumber);
    if (user) return ResponseHandler.sendErr(res, Messages.SMS.ERR.ALREADY_EXISTS);

    // Generar certificado validando que ese did le corresponde al dueño del teléfono
    const cert = await CertService.createPhoneCertificate(did, cellPhoneNumber);
    await CertService.verifyCertificatePhoneNumber(cert);

    // Revocar certificado anterior
    const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.TEL);
    for (const elem of old) {
      elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
      const jwt = await elem.getJwt();
      await MouroService.revokeCertificate(jwt, elem.hash, did);
    }

    // Mandar certificado a mouro
    const jwt = await MouroService.saveCertificate(cert, did);

    // Validar código y actualizar pedido de validación de teléfono
    await Certificate.generate(
      Constants.CERTIFICATE_NAMES.TEL,
      did,
      Constants.CERTIFICATE_STATUS.UNVERIFIED,
      jwt.data,
      jwt.hash,
    );
    await SmsService.validatePhone(phone, did);
    return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.MATCHED(cert));
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createCertificateBySmsValidation,
};
