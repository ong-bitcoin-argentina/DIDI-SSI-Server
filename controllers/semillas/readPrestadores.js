const SemillasService = require('../../services/SemillasService');
const ResponseHandler = require('../../utils/ResponseHandler');

const readPrestadores = async (req, res) => {
  try {
    const result = await SemillasService.getPrestadores();
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readPrestadores,
};
