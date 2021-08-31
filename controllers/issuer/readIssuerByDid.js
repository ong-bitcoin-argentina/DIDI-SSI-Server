const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');

const readIssuerByDid = async (req, res) => {
  const { did } = req.params;

  try {
    const issuer = await IssuerService.getIssuerByDID(did);
    if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);
    const {
      name, description, imageUrl, expireOn,
    } = issuer;

    const issuerData = {
      name, description, imageUrl, did, expireOn,
    };

    return ResponseHandler.sendRes(res, issuerData);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readIssuerByDid,
};
