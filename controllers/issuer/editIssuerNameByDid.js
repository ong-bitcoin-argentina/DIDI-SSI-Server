const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');

const editIssuerNameByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const { name } = req.body;

    const issuer = await IssuerService.editName(did, name);

    return ResponseHandler.sendRes(res, issuer.name);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  editIssuerNameByDid,
};
