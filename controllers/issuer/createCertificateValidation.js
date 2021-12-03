/* eslint-disable no-console */
const ResponseHandler = require('../../utils/ResponseHandler');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');

const createCertificateValidation = async (req, res) => {
  const { jwt } = req.body;
  try {
    // validar formato y desempaquetar
    console.log('Verifying JWT...');
    const decripted = await CertService.decodeCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
    const hash = await MouroService.isInMouro(
      jwt,
      decripted.payload.sub,
      Messages.ISSUER.ERR.NOT_FOUND,
    );
    const cert = await CertService.verifyCertificate(
      jwt,
      hash,
      Messages.ISSUER.ERR.CERT_IS_INVALID,
    );
    if (!cert || !cert.payload.vc) {
      return ResponseHandler.sendRes(res, { cert, err: Messages.ISSUER.ERR.CERT_IS_INVALID });
    }
    console.log('JWT verified!');

    console.log('Verifying Issuer...');
    const did = cert.payload.iss;
    await IssuerService.verifyIssuer(did);
    const issuer = await IssuerService.getIssuerByDID(did);
    if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);
    console.log('Issuer verified!');
    cert.issuer = issuer.name;
    return ResponseHandler.sendRes(res, cert);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createCertificateValidation,
};
