/* eslint-disable no-console */
const Certificate = require('../../models/Certificate');
const ResponseHandler = require('../../utils/ResponseHandler');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const UserService = require('../../services/UserService');
const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const deleteCertificate = async (req, res) => {
  const { did } = req.body;
  const { sub } = req.body;
  const { jwt } = req.body;
  const { hash } = req.body;
  try {
    // Validar certificado y emisor
    console.log('Revoking JWT...');
    const cert = await CertService.verifyCertificate(
      jwt,
      hash,
      Messages.ISSUER.ERR.CERT_IS_INVALID,
    );
    if (!cert) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);
    // Validar si el emistor es correcto (autorizado a revocar)
    console.log(`Verifying issuer ${did}`);
    const valid = cert && (await IssuerService.verifyIssuer(did));
    if (!valid) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);
    // Validar que el sujeto este registrado en didi
    console.log(`Verifying subject ${sub}`);
    const subject = await UserService.getByDID(sub);
    if (!subject) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_SUB_IS_INVALID);
    // Revocar certificado
    console.log('Revoking in Mouro...');
    await MouroService.revokeCertificate(jwt, hash, sub);
    // Actualizar estado
    console.log('Updating cert status...');
    await Certificate.generate(
      Constants.CERTIFICATE_NAMES.GENERIC,
      cert.payload.sub,
      Constants.CERTIFICATE_STATUS.REVOKED,
      jwt,
      hash,
    );
    console.log('Revoked successfully');
    return ResponseHandler.sendRes(res, Messages.ISSUER.CERT_REVOKED);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  deleteCertificate,
};
