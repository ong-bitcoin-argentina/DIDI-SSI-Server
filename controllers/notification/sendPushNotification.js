const UserService = require('../../services/UserService');
const FirebaseService = require('../../services/FirebaseService');
const ResponseHandler = require('../../utils/ResponseHandler');
const { getTokenData } = require('../../services/TokenService');
const Messages = require('../../constants/Messages');

const sendNotification = async (req, res) => {
  const { authorization } = req.headers;
  const { title, message } = req.body;
  try {
    const { payload } = await getTokenData(authorization);
    const { did } = payload;
    // eslint-disable-next-line no-console
    console.log('sending push notification');
    const user = await UserService.getByDID(did);
    await FirebaseService.sendPushNotification(
      title,
      message,
      user.firebaseId,
      Messages.PUSH.TYPES.SHARE_RES,
    );
    return ResponseHandler.sendRes(res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error sending push notifications:');
    return ResponseHandler.sendErrWithStatus(res, error);
  }
};

module.exports = {
  sendNotification,
};
