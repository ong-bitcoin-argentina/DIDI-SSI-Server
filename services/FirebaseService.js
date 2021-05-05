/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const firebaseAdmin = require('firebase-admin');
const Messages = require('../constants/Messages');
const Constants = require('../constants/Constants');

/**
 * Comprobar existencia de variables de entorno necesarias,
 * luego inicializar Firebase
 */
function hasFirebaseInEnv() {
  return Constants.FIREBASE_URL && Constants.FIREBASE_PRIV_KEY_PATH;
}
if (hasFirebaseInEnv()) {
  const credentialAccount = require(Constants.FIREBASE_PRIV_KEY_PATH);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(credentialAccount),
    databaseURL: Constants.FIREBASE_URL,
  });
}

/**
 *  Crear y mandar una push notification
 *  TODO: Fix eslint consistent-return
 */
module.exports.sendPushNotification = async function sendPushNotification(
  title, message, firebaseId, type,
) {
  if (!hasFirebaseInEnv() || !firebaseId) return;

  const msg = {
    notification: {
      title,
      body: message,
    },
    token: firebaseId,
    data: { notificationType: type },
  };

  try {
    // eslint-disable-next-line no-console
    console.log('sent');
    const response = await firebaseAdmin.messaging().send(msg);
    // eslint-disable-next-line no-console
    console.log(response);
    // eslint-disable-next-line consistent-return
    return Promise.resolve(response);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // eslint-disable-next-line consistent-return
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};
