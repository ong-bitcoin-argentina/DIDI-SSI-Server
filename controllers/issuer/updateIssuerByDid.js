/* eslint-disable max-len */
const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');

const updateIssuerByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const { name, description, imageUrl } = req.body;

    const issuer = await IssuerService.editData(did, name, description, imageUrl);

    return ResponseHandler.sendRes(res, issuer);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateIssuerByDid,
};
