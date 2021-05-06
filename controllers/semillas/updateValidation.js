const SemillasService = require('../../services/SemillasService');
const ResponseHandler = require('../../utils/ResponseHandler');

const updateValidation = async (req, res) => {
  const { did, state } = req.body;
  try {
    const result = await SemillasService.updateValidationState(did, state);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  updateValidation,
};
