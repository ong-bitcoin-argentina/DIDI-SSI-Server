const ShareRequest = require('../../models/ShareRequest');
const ResponseHandler = require('../../utils/ResponseHandler');
const { getPayload } = require('../../services/TokenService');
const Messages = require('../../constants/Messages');

const readAllShareRequests = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const { aud, iss } = req.query;
    const jwt = req.header('Authorization');
    const did = getPayload(jwt).iss;

    if (aud && iss) {
      throw Messages.SHAREREQUEST.ERR.PARAM_ERROR('iss, aud');
    }

    const { list, totalPages } = await ShareRequest.getAll(limit, page, aud, iss, did);

    return ResponseHandler.sendRes(res, { list, totalPages });
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAllShareRequests,
};
