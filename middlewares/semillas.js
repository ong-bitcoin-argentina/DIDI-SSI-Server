const { ENABLE_SEMILLAS } = require('../constants/Constants');
const ResponseHandler = require('../utils/ResponseHandler');

module.exports = (req, res, next) => {
  if (!ENABLE_SEMILLAS) {
    ResponseHandler.sendErrWithStatus(res, 'Rutas de Semillas deshabilitadas', 403);
  } else next();
};
