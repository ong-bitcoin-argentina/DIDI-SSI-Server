const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');
const Messages = require('../../constants/Messages');

const updateFirebaseId = async (req, res) => {
  const did = req.context.tokenData.iss;
  const { firebaseId } = req.context.tokenData;

  try {
    // Renueva el firebaseId
    const user = await UserService.getByDID(did);
    if (!user) return ResponseHandler.sendErr(res, Messages.USER.ERR.GET);

    await user.updateFirebaseId(firebaseId);
    return ResponseHandler.sendRes(res, { firebaseId: user.firebaseId });
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateFirebaseId,
};
