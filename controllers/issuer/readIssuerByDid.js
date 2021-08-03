const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');
const { getImageUrl } = require('../../utils/Helpers');

const readIssuerByDid = async (req, res) => {
  const { did } = req.params;

  try {
    const issuer = await IssuerService.getIssuerByDID(did);
    if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);

    const { name, description, imageId } = issuer;

    const imageUrl = getImageUrl(imageId);

    const issuerData = {
      name, description, imageUrl, imageId,
    };

    return ResponseHandler.sendRes(res, issuerData);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readIssuerByDid,
};
