const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');
const ResponseHandler = require('../../utils/ResponseHandler');

const readIssuerImagesByDid = async (req, res) => {
  const { did } = req.params;

  try {
    const issuer = await IssuerService.getIssuerByDID(did);
    if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);

    const { imageUrl, imageId } = issuer;

    return ResponseHandler.sendRes(res, [imageUrl, imageId]);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readIssuerImagesByDid,
};
