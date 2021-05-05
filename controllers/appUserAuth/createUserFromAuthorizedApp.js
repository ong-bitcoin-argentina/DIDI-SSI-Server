const UserAppService = require('../../services/UserAppService');
const ResponseHandler = require('../../utils/ResponseHandler');

const createUserFromAuthorizedApp = async (req, res) => {
  const { userJWT } = req.body;
  const appJWT = req.header('Authorization');
  try {
    const result = await UserAppService.createByTokens(userJWT, appJWT);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  createUserFromAuthorizedApp,
};
