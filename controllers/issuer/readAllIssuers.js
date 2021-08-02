const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const { getImageUrl } = require('../../utils/Helpers');

const readAllIssuers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);

    const issuers = await IssuerService.getAll(limit, page);

    const issuerList = issuers.map(({
      name, did, description, imageId,
    }) => ({
      name, did, description, imageUrl: getImageUrl(imageId),
    }));

    return ResponseHandler.sendRes(res, issuerList);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAllIssuers,
};
