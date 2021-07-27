const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');

const readIssuerImageByDid = async (req, res) => {
  const { did } = req.params;

  try {
    const issuer = await IssuerService.getIssuerByDID(did);
    if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);

    const { img, contentType } = await IssuerService.getImage(issuer.imageId);

    res.type(contentType);
    return res.send(img);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readIssuerImageByDid,
};
