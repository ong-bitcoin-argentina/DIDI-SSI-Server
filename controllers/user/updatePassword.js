const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');
const Messages = require('../../constants/Messages');

const updatePassword = async (req, res) => {
  const { did } = req.body;
  const { oldPass } = req.body;
  const { newPass } = req.body;

  try {
    // Validar contraseña y actualizarla
    await UserService.changePassword(did, oldPass, newPass);
    return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updatePassword,
};
