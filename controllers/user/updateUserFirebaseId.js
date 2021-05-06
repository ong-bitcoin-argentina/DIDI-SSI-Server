const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');
const Messages = require('../../constants/Messages');

const updateUserFirebaseId = async (req, res) => {
  const { did } = req.body;
  const { password } = req.body;
  const eMail = req.body.eMail.toLowerCase();
  const { firebaseId } = req.body;

  try {
    // Validar la contraseña y retornar un boolean
    const user = await UserService.login(did, eMail, password);
    if (firebaseId) await user.updateFirebaseId(firebaseId);
    return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.LOGGED_IN);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateUserFirebaseId,
};
