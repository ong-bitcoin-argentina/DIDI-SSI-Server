const SemillasService = require('../../services/SemillasService');
const ResponseHandler = require('../../utils/ResponseHandler');

const removeDniValidationByDid = async (req, res) => {
  const { did } = req.body;
  try {
    const result = await SemillasService.deleteValidationByDid(did);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  removeDniValidationByDid,
};
