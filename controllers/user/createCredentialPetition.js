/* eslint-disable no-console */
const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const FirebaseService = require('../../services/FirebaseService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const createCredentialPetition = async (req, res) => {
  const { did } = req.body;
  const { jwt } = req.body;

  try {
    const decoded = await CertService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);
    const name = Object.keys(decoded.payload.vc.credentialSubject)[0];

    const cb = `${Constants.ADDRESS}:${Constants.PORT}/api/1.0/didi/verifyCredential`;
    const claims = {
      verifiable: {
        [name]: {
          jwt,
          essential: true,
        },
      },
    };

    const petition = await CertService.createPetition(did, claims, cb);

    try {
      // Enviar push notification
      const user = await UserService.getByDID(did);
      await FirebaseService.sendPushNotification(
        Messages.PUSH.VALIDATION_REQ.TITLE,
        Messages.PUSH.VALIDATION_REQ.MESSAGE,
        user.firebaseId,
        Messages.PUSH.TYPES.VALIDATION_REQ,
      );
    } catch (err) {
      console.log('Error sending push notifications:');
      console.log(err);
    }

    const result = await MouroService.saveCertificate(petition, did);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createCredentialPetition,
};
