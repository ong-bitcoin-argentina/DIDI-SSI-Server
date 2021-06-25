const { handleValidateAppJWT } = require('./ValidateAppJWT');
const { verifyCertificate } = require('../services/CertService');
const ResponseHandler = require('../utils/ResponseHandler');
const {
  TOKEN: { INVALID_CODE },
} = require('../constants/Messages');
const Messages = require('../constants/Messages');

// eslint-disable-next-line consistent-return
const validateAppOrUserJWT = async (req, res, next) => {
  try {
    const { userJWT } = req.body;
    if (!userJWT) {
      await handleValidateAppJWT(req);
      return next();
    }
    // eslint-disable-next-line max-len
    const userVerified = await verifyCertificate(userJWT, undefined, Messages.ISSUER.ERR.IS_INVALID);
    if (!userVerified.payload) throw INVALID_CODE(true);
    next();
  } catch (e) {
    ResponseHandler.sendErrWithStatus(res, e, 400);
  }
};

module.exports = {
  validateAppOrUserJWT,
};
