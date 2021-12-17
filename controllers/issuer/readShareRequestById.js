const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const { decodeJWT } = require('../../services/BlockchainService');

const readShareRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const { jwt } = await IssuerService.getShareRequestById(id);

    const { payload } = await decodeJWT(jwt);

    return ResponseHandler.sendRes(res, payload);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readShareRequestById,
};
