const IssuerService = require('../services/IssuerService');

const sendCallbackIssuer = async (callbackTask) => {
  const newDelegate = true;
  const {
    callbackUrl, did, token, status, expireOn, blockHash, messageError,
  } = callbackTask;
  if (!callbackUrl) return;
  await IssuerService.callback(callbackUrl, did, token, {
    status, expireOn, blockHash, messageError, newDelegate,
  });
};

exports.actions = {
  Post: sendCallbackIssuer,
};
