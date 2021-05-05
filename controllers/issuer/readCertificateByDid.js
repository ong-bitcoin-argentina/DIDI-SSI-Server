/* eslint-disable no-console */
const ResponseHandler = require('../../utils/ResponseHandler');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const UserService = require('../../services/UserService');
const FirebaseService = require('../../services/FirebaseService');
const Messages = require('../../constants/Messages');

const readCertificateByDid = async (req, res) => {
  const { did } = req.body;
  const { jwt } = req.body;
  try {
    // Comprobar que el emisor sea valido
    const decoded = await CertService.decodeCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
    await CertService.verifyIssuer(decoded.payload.iss);
    // Crear el pedido
    const shareReq = await CertService.createShareRequest(did, jwt);
    // Mandar el pedido a mouro para ser guardado
    const result = await MouroService.saveCertificate(shareReq, did);
    try {
      // Enviar push notification
      const user = await UserService.getByDID(did);
      await FirebaseService.sendPushNotification(
        Messages.PUSH.SHARE_REQ.TITLE,
        Messages.PUSH.SHARE_REQ.MESSAGE,
        user.firebaseId,
        Messages.PUSH.TYPES.SHARE_REQ,
      );
    } catch (err) {
      console.log('Error sending push notifications:');
      console.log(err);
    }
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readCertificateByDid,
};
