const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const Constants = require('../../constants/Constants');

const { CREATE } = Constants.DELEGATE_ACTIONS;

const createDelegation = async (req, res) => {
  const {
    did, name, callbackUrl, token, description, imageUrl,
  } = req.body;

  try {
    const delegateTransaction = await IssuerService.createDelegateTransaction({
      did,
      name,
      description,
      callbackUrl,
      token,
      action: CREATE,
      imageUrl,
    });

    return ResponseHandler.sendRes(res, delegateTransaction);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErrWithStatus(res, err, 403);
  }
};

module.exports = {
  createDelegation,
};
