const { saveShareRequest } = require('../../services/ShareRequestService');
const ResponseHandler = require('../../utils/ResponseHandler');

const createShareRequest = async (req, res) => {
  try {
    const { _id } = await saveShareRequest(req.body);
    return ResponseHandler.sendRes(res, _id);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createShareRequest,
};
