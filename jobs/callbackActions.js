const IssuerService = require('../services/IssuerService');

const sendCallbackIssuer = async (callbackTask) => {
  const {
    callbackUrl, did, token, status, expireOn, blockHash, messageError,
  } = callbackTask;
  if (!callbackUrl) return;
  await IssuerService.callback(callbackUrl, did, token, {
    status, expireOn, blockHash, messageError,
  });
};

exports.actions = {
  Post: sendCallbackIssuer,
};
