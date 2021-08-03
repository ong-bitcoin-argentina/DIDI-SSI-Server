/* eslint-disable max-len */
const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const updateIssuerByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const { name, description } = req.body;

    // Actualizar nombre y descripción
    await IssuerService.editData(did, name, description);

    // Actualizar imagen
    if (req.file) {
      const { path, mimetype, size } = req.file;
      if (size > Constants.MAX_MB * 1000000) return ResponseHandler.sendErr(res, Messages.IMAGE.ERR.INVALID_SIZE);
      await IssuerService.saveImage(did, mimetype, path);
    }

    const issuerUpdated = await IssuerService.getIssuerByDID(did);

    return ResponseHandler.sendRes(res, issuerUpdated);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateIssuerByDid,
};
