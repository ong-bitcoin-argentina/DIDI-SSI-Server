const ShareResponse = require('../../services/ShareResponseService');
const ResponseHandler = require('../../utils/ResponseHandler');

const addShareResponse = async (req, res) => {
  try {
    const result = await ShareResponse.addShareResponse(req.body, req.params);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  addShareResponse,
};
