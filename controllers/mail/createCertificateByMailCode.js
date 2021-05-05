/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const ResponseHandler = require('../../utils/ResponseHandler');
const Certificate = require('../../models/Certificate');
const MailService = require('../../services/MailService');
const UserService = require('../../services/UserService');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const createCertificateByMailCode = async (req, res) => {
  const { validationCode } = req.body;
  const eMail = req.body.eMail.toLowerCase();
  const { did } = req.body;
  try {
    // Validar código
    const mail = await MailService.isValid(eMail, validationCode);
    // Verificar que no exista un usuario con ese mail
    const user = await UserService.getByEmail(eMail);
    if (user) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.ALREADY_EXISTS);
    // Generar certificado validando que ese did le corresponde al dueño del mail
    const cert = await CertService.createMailCertificate(did, eMail);
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
    // Validar código y actualizar pedido de validación de mail
    await Certificate.generate(
      Constants.CERTIFICATE_NAMES.EMAIL,
      did,
      Constants.CERTIFICATE_STATUS.UNVERIFIED,
      jwt.data,
      jwt.hash,
    );
    await MailService.validateMail(mail, did);
    return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.MATCHED(cert));
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createCertificateByMailCode,
};
