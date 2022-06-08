const ShareResponse = require('../../services/ShareResponseService');
const ResponseHandler = require('../../utils/ResponseHandler');

const addShareResponse = async (req, res) => {
  try {
    const jwt = req.body;
    const did = req.params;
    const result = await ShareResponse.addShareResponse(jwt, did);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  addShareResponse,
};
