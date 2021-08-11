/* eslint-disable max-len */
const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');

const updateIssuerByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const { name, description } = req.body;

    // Actualizar nombre y descripción
    await IssuerService.editData(did, name, description);

    // Actualizar imagen
    if (req.file) {
      const { path, mimetype } = req.file;
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
