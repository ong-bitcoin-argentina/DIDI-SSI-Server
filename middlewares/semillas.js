const { ENABLE_SEMILLAS } = require('../constants/Constants');
const ResponseHandler = require('../utils/ResponseHandler');

const semillasMiddelware = (req, res, next) => {
  if (!ENABLE_SEMILLAS) {
    ResponseHandler.sendErrWithStatus(res, 'Rutas de Semillas deshabilitadas', 403);
  } else next();
};

module.exports = {
  semillasMiddelware,
};
