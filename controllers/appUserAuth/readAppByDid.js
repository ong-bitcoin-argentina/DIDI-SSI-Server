const AppAuthService = require('../../services/AppAuthService');
const ResponseHandler = require('../../utils/ResponseHandler');

const readAppByDid = async (req, res) => {
  const { did } = req.params;
  try {
    const result = await AppAuthService.findByDID(did);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  readAppByDid,
};
