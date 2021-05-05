const ResponseHandler = require('../utils/ResponseHandler');
const { verifyToken, getPayload } = require('../services/TokenService');
const {
  VALIDATION: { ADMIN_DID_NOT_MATCH },
  TOKEN: { INVALID_CODE },
} = require('../constants/Messages');
const Admin = require('../models/Admin');

const handleValidateAdminJWT = async (req) => {
  const jwt = req.header('Authorization');
  const did = getPayload(jwt).iss;

  const admin = await Admin.getByDID(did);
  if (!admin) throw ADMIN_DID_NOT_MATCH(did);

  // check cache for performance purposes
  if (admin.jwt === jwt) return;

  const verified = await verifyToken(jwt);
  if (!verified.payload) throw INVALID_CODE();

  // cache for performance purposes
  admin.jwt = jwt;
  await admin.save();
};

// eslint-disable-next-line consistent-return
const validateAdminJWT = async (req, res, next) => {
  try {
    await handleValidateAdminJWT(req);
    next();
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err, 400);
  }
};

module.exports = {
  validateAdminJWT,
};
