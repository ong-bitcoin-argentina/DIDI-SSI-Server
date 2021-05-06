const ResponseHandler = require('../../utils/ResponseHandler');
const { getPresentation } = require('../../services/PresentationService');

const readPresentationById = async (req, res) => {
  try {
    const { jwts } = await getPresentation(req.params);
    return ResponseHandler.sendRes(res, jwts);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readPresentationById,
};
