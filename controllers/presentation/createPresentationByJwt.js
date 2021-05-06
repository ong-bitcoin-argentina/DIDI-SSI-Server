const ResponseHandler = require('../../utils/ResponseHandler');
const { savePresentation } = require('../../services/PresentationService');

const createPresentationByJwt = async (req, res) => {
  try {
    const { _id } = await savePresentation(req.body);
    return ResponseHandler.sendRes(res, _id);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createPresentationByJwt,
};
