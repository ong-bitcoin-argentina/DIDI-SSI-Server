/* eslint-disable no-console */
const ResponseHandler = require('../../utils/ResponseHandler');
const CertService = require('../../services/CertService');
const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');

const readIssuerByDid = async (req, res) => {
  try {
    const { did } = req.body;
    await CertService.verifyIssuer(did);
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
  readIssuerByDid,
};
