/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
const Certificate = require('../../models/Certificate');
const ResponseHandler = require('../../utils/ResponseHandler');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const updateCredentialPetition = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { access_token } = req.body;

  const data = await CertService.decodeCertificate(access_token, Messages.CERTIFICATE.ERR.VERIFY);
  const jwt = data.payload.verified[0];

  try {
    // Validar que el certificado este en mouro
    const hash = await MouroService.isInMouro(jwt, data.payload.iss, Messages.ISSUER.ERR.NOT_FOUND);
    if (!hash) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.NOT_FOUND);

    // Obtener el certificado según el hash de mouro
    const cert = await Certificate.findByHash(hash);
    const certDid = await cert.getDid();

    // Verificar que el emisor sea el correcto
    if (certDid !== data.payload.iss) return ResponseHandler.sendErr(res, Messages.USER.ERR.VALIDATE_DID_ERROR);

    // Obtener y decodificar jwt
    const certJwt = await cert.getJwt();
    const decoded = await CertService.decodeCertificate(certJwt, Messages.CERTIFICATE.ERR.VERIFY);

    // Si existen, se marca cada microcredencial como validada
    const credData = decoded.payload.vc.credentialSubject;
    const certCategory = Object.keys(credData)[0];
    const wrappedIndex = Object.keys(credData[certCategory]).indexOf('wrapped');
    if (wrappedIndex >= 0) {
      for (const key of Object.keys(credData[certCategory].wrapped)) {
        const mouroHash = await MouroService.isInMouro(
          credData[certCategory].wrapped[key],
          data.payload.iss,
          Messages.ISSUER.ERR.NOT_FOUND,
        );
        if (!mouroHash) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.NOT_FOUND);

        // Validación de microcredencial
        const microCert = await Certificate.findByHash(mouroHash);
        microCert.update(Constants.CERTIFICATE_STATUS.VERIFIED);
      }
    }
    // Se marca el certificado como validado
    cert.update(Constants.CERTIFICATE_STATUS.VERIFIED);
    return ResponseHandler.sendRes(res, {});
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateCredentialPetition,
};
