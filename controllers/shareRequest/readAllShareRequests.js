const ShareRequest = require('../../models/ShareRequest');
const ResponseHandler = require('../../utils/ResponseHandler');

const readAllShareRequests = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const { aud, iss } = req.query;

    const { list, totalPages } = await ShareRequest.getAll(limit, page, aud, iss);

    return ResponseHandler.sendRes(res, { list, totalPages });
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAllShareRequests,
};
