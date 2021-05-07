const UserAppService = require('../../services/UserAppService');
const ResponseHandler = require('../../utils/ResponseHandler');

const readUserAppByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const result = await UserAppService.findByUserDID(did);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  readUserAppByDid,
};
