const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const Constants = require('../../constants/Constants');

const { REFRESH } = Constants.DELEGATE_ACTIONS;

const refreshDelegation = async (req, res) => {
  try {
    const { did } = req.params;
    const { token, callbackUrl } = req.body;

    const delegateTransaction = await IssuerService.createDelegateTransaction({
      did,
      callbackUrl,
      token,
      action: REFRESH,
    });

    return ResponseHandler.sendRes(res, delegateTransaction);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErrWithStatus(res, err, 403);
  }
};

module.exports = {
  refreshDelegation,
};
