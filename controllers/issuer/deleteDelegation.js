const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const Constants = require('../../constants/Constants');

const { REVOKE } = Constants.DELEGATE_ACTIONS;

const deleteDelegation = async (req, res) => {
  const { did, callbackUrl, token } = req.body;
  try {
    const delegateTransaction = await IssuerService.createDelegateTransaction({
      did,
      callbackUrl,
      token,
      action: REVOKE,
    });
    return ResponseHandler.sendRes(res, delegateTransaction);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  deleteDelegation,
};
