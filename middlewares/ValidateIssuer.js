const BlockchainService = require('../services/BlockchainService');
const { sendErrWithStatus, sendErr } = require('../utils/ResponseHandler');
const Messages = require('../constants/Messages');
const { getPayload } = require('../services/TokenService');
const { missingIssuerDid, missingJwt } = require('../constants/serviceErrors');

const ValidateIssuer = async (req, res, next) => {
  try {
    const { jwt } = req.body;
    if (!jwt) throw missingJwt;
    const { iss } = await getPayload(jwt);
    if (!iss) throw missingIssuerDid;
    const isValidDelegate = await BlockchainService.validDelegate(iss);
    if (!isValidDelegate) sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);
    next();
  } catch (e) {
    sendErrWithStatus(res, e, 401);
  }
};

module.exports = {
  ValidateIssuer,
};
