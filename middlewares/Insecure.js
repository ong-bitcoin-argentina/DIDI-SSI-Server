const { ENABLE_INSECURE_ENDPOINTS } = require('../constants/Constants');

module.exports = (req, res, next) => {
  if (!ENABLE_INSECURE_ENDPOINTS) {
    throw new Error('Disabled endpoint');
  }
  next();
};
