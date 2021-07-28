/* eslint-disable no-console */
const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');

const readAllIssuers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);

    const issuers = await IssuerService.getAll(limit, page);

    return ResponseHandler.sendRes(res, issuers);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAllIssuers,
};
