/* eslint-disable no-console */
const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');

const verifyIssuerByDid = async (req, res) => {
  try {
    const { did } = req.params;
    await IssuerService.verifyIssuer(did);
    const issuer = await IssuerService.getIssuerByDID(did);
    if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);
    const { name, expireOn } = issuer;
    return ResponseHandler.sendRes(res, { did, name, expireOn });
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  verifyIssuerByDid,
};
