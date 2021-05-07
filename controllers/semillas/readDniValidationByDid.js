const SemillasService = require('../../services/SemillasService');
const ResponseHandler = require('../../utils/ResponseHandler');

const readDniValidationByDid = async (req, res) => {
  const { did } = req.params;
  try {
    const result = await SemillasService.getValidation(did);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  readDniValidationByDid,
};
