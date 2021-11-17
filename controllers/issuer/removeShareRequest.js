/* eslint-disable max-len */
const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const { deleteShareRequest } = require('../../services/ShareRequestService');
const Messages = require('../../constants/Messages');

const removeShareRequest = async (req, res) => {
  try {
    const { id, did } = req.params;

    try {
      await deleteShareRequest(id);
    } catch (error) {
      return ResponseHandler.sendRes(res, Messages.SHAREREQUEST.ERR.DELETE);
    }

    const issuer = await IssuerService.removeShareRequest(id, did);

    return ResponseHandler.sendRes(res, issuer);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  removeShareRequest,
};
