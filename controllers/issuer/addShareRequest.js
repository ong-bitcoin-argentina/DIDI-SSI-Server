/* eslint-disable max-len */
const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const { saveShareRequest } = require('../../services/ShareRequestService');

const addShareRequest = async (req, res) => {
  try {
    const { did } = req.params;
    const { jwt } = req.body;

    const { _id } = await saveShareRequest({ jwt });

    const issuer = await IssuerService.addShareRequests([_id], did);

    return ResponseHandler.sendRes(res, { id: _id, issuer });
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  addShareRequest,
};
