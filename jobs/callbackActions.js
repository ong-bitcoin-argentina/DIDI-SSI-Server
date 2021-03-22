const IssuerService = require("../services/IssuerService");

const sendCallbackIssuer = async callbackTask => {
	const { _id, callbackUrl, did, token, status, expireOn, blockHash, messageError } = callbackTask;
	await IssuerService.callback(callbackUrl, did, token, { status, expireOn, blockHash, messageError });
};

exports.actions = {
	Post: sendCallbackIssuer
};
