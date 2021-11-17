const { verifyToken } = require('../services/TokenService');
const {
  TOKEN: { INVALID_CODE },
} = require('../constants/Messages');
const { sendErrWithStatus } = require('../utils/ResponseHandler');

const validateAuth = async (req, res, next) => {
  try {
    const jwt = req.header('Authorization');
    const { payload } = await verifyToken(jwt);
    if (!payload) throw INVALID_CODE(true);
    next();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    sendErrWithStatus(res, e, 401);
  }
};

module.exports = {
  validateAuth,
};
