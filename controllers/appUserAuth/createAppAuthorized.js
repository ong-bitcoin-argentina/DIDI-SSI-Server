const AppAuthService = require('../../services/AppAuthService');
const ResponseHandler = require('../../utils/ResponseHandler');

const createAppAuthorized = async (req, res) => {
  try {
    const { did, name } = req.body;
    const didi = await AppAuthService.createApp(did, name);
    return ResponseHandler.sendRes(res, didi);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  createAppAuthorized,
};
