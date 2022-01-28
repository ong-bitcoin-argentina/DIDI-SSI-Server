const userService = require('../../services/UserService');
const ResponseHandler = require('../../utils/ResponseHandler');

const verifyUserByToken = async (req, res) => {
  try {
    const { jwt } = req.body;
    await userService.verifyUserByToken(jwt);
    return ResponseHandler.sendRes(res, 'verificado');
  } catch (error) {
    return ResponseHandler.sendErrWithStatus(res, error);
  }
};

module.exports = { verifyUserByToken };
