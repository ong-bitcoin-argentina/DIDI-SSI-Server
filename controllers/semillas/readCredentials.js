const SemillasService = require('../../services/SemillasService');
const ResponseHandler = require('../../utils/ResponseHandler');

const readCredentials = async (req, res) => {
  try {
    const { did, dni } = req.body;
    const didi = await SemillasService.sendDIDandDNI({ did, dni });
    return ResponseHandler.sendRes(res, didi);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readCredentials,
};
