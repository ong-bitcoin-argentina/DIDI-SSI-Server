const { v1: shareReqSchema } = require('@proyecto-didi/vc-validator/dist/messages/shareRequest-schema');
const { validateCredential } = require('@proyecto-didi/vc-validator/dist/validator');
const {
  SHAREREQUEST: { ERR },
} = require('../constants/Messages');
const { sendErrWithStatus } = require('../utils/ResponseHandler');
const { getPayload } = require('../services/TokenService');
const { missingJwt } = require('../constants/serviceErrors');
const BlockchainService = require('../services/BlockchainService');

const ValidateSchema = async (req, res, next) => {
  try {
    const { jwt } = req.body;
    if (!jwt) throw missingJwt;
    let validation;
    const { type, aud } = await getPayload(jwt);
    const verified = await BlockchainService.verifyJWT(jwt, aud);
    if (!verified?.payload) throw ERR.INVALID_JWT;
    if (!!type && type === 'shareReq') {
      validation = validateCredential(shareReqSchema, jwt);
      if (!validation.status && validation.errors.length) {
        throw ERR.VALIDATION_ERROR(validation.errors.map((e) => e.message));
      }
      return next();
    }
    const errors = ['El parametro type recibido no esta actualmente soportado'];
    throw ERR.VALIDATION_ERROR(errors);
  } catch (e) {
    sendErrWithStatus(res, e, 400);
  }
};

module.exports = {
  ValidateSchema,
};
