/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const ResponseHandler = require('../../utils/ResponseHandler');
const Certificate = require('../../models/Certificate');
const UserService = require('../../services/UserService');
const MailService = require('../../services/MailService');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const updateEmail = async (req, res) => {
  const { did } = req.body;
  const { eMailValidationCode } = req.body;
  const newEMail = req.body.newEMail.toLowerCase();
  const { password } = req.body;

  try {
    // Validar mail nuevo en uso
    await UserService.emailTaken(newEMail, did);

    // Validar codigo
    const mail = await MailService.isValid(newEMail, eMailValidationCode);
    if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);

    // Generar certificado validando que ese did le corresponde al dueño del mail
    const cert = await CertService.createMailCertificate(did, newEMail);
    await CertService.verifyCertificateEmail(cert);

    // Revocar certificado anterior
    const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.EMAIL);
    for (const elem of old) {
      elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
      const jwt = await elem.getJwt();
      await MouroService.revokeCertificate(jwt, elem.hash, did);
    }

    // Mandar certificado a mouro
    const jwt = await MouroService.saveCertificate(cert, did);

    // Actualizar mail
    await UserService.changeEmail(did, newEMail, password);

    // Validar código y actualizar pedido de validación de mail
    await Certificate.generate(
      Constants.CERTIFICATE_NAMES.EMAIL,
      did,
      Constants.CERTIFICATE_STATUS.UNVERIFIED,
      jwt.data,
      jwt.hash,
    );
    await MailService.validateMail(mail, did);
    return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_EMAIL(cert));
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateEmail,
};
