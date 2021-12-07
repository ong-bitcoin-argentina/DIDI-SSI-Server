const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const { decodeJWT } = require('../../services/BlockchainService');

const readShareRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const { jwt } = await IssuerService.getShareRequestById(id);

    const shareRequest = await decodeJWT(jwt);

    return ResponseHandler.sendRes(res, shareRequest);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readShareRequestById,
};
