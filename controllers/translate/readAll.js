const ResponseHandler = require('../../utils/ResponseHandler');
const { CREDENTIAL_CATEGORIES } = require('../../constants/Messages');

const readAll = async (req, res) => {
  const translate = {
    credential_categories: CREDENTIAL_CATEGORIES,
  };
  return ResponseHandler.sendRes(res, translate);
};

module.exports = {
  readAll,
};
