const SemillasService = require('../../services/SemillasService');
const ResponseHandler = require('../../utils/ResponseHandler');
const Messages = require('../../constants/Messages');

const { SUCCESS } = Messages.SEMILLAS;

const createValidationDni = async (req, res) => {
  try {
    await SemillasService.validateDni(req.body);
    await SemillasService.generateValidation(req.body.did);
    return ResponseHandler.sendRes(res, SUCCESS.VALIDATE_DNI);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  createValidationDni,
};
