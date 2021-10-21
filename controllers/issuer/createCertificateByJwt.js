/* eslint-disable max-len */
/* eslint-disable no-console */
const ResponseHandler = require('../../utils/ResponseHandler');
const Certificate = require('../../models/Certificate');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const UserService = require('../../services/UserService');
const FirebaseService = require('../../services/FirebaseService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const createCertificateByJwt = async (req, res) => {
  const { jwt } = req.body;
  try {
    console.log('Issuing JWT...');
    // validar certificado y emisor (que este autorizado para emitir)
    console.log('Verifying JWT...');
    const cert = await CertService.verifyCertificate(jwt, undefined, Messages.ISSUER.ERR.IS_INVALID);
    if (!cert || !cert.payload) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);
    // Validar si el emistor es correcto (autorizado a emitir y el mismo que el del certificado)
    console.log(`Verifying issuer ${cert.payload.iss}`);
    const valid = cert && (await CertService.verifyIssuer(cert.payload.iss));
    if (!valid) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);
    // Validar sujeto (que este registrado en didi)
    console.log(`Verifying subject ${cert.payload.sub}`);
    const { sub } = cert.payload;
    const subject = await UserService.getByDID(sub);
    if (!subject) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_SUB_IS_INVALID);
    console.log('Issued successfully!');
    // Guardar certificado en mouro
    console.log('Storing in mouro...');
    const result = await MouroService.saveCertificate(jwt, cert.payload.sub);
    // Guardar estado
    await Certificate.generate(
      Constants.CERTIFICATE_NAMES.GENERIC,
      cert.payload.sub,
      Constants.CERTIFICATE_STATUS.UNVERIFIED,
      result.data,
      result.hash,
    );
    // Guardar hash de recuperacion (swarm)
    console.log('Asking for hash in mouro...');
    const hash = await MouroService.getHash(cert.payload.sub);
    if (hash) await subject.updateHash(hash);
    // Enviar push notification
    if (req.body.sendPush) {
      console.log('Sending push notification!');
      try {
        const user = await UserService.getByDID(sub);
        await FirebaseService.sendPushNotification(
          Messages.PUSH.NEW_CERT.TITLE,
          Messages.PUSH.NEW_CERT.MESSAGE,
          user.firebaseId,
          Messages.PUSH.TYPES.NEW_CERT,
        );
      } catch (err) {
        console.log('Error sending push notifications:');
        console.log(err);
      }
    }
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createCertificateByJwt,
};
