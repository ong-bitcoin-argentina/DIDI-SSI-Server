const userService = require('../../services/UserService');
const ResponseHandler = require('../../utils/ResponseHandler');

const verifyUserByToken = async (req, res) => {
  try {
    const { jwt } = req.body;
    const user = await userService.verifyUserByToken(jwt);
    return ResponseHandler.sendRes(res, user);
  } catch (error) {
    return ResponseHandler.sendErrWithStatus(res, error);
  }
};

module.exports = { verifyUserByToken };
