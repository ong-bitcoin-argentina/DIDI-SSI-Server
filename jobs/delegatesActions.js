const Constants = require("../constants/Constants");
const IssuerService = require("../services/IssuerService");
const BlockchainService = require("../services/BlockchainService");
const { ERROR, DONE, ERROR_RENEW, REVOKE: REVOKE_STATUS } = Constants.STATUS;
const { CREATE, REFRESH, REVOKE } = Constants.DELEGATE_ACTIONS;

const exCallback = async ({ callbackUrl, did, token, status = ERROR, expireOn, blockHash, messageError }) => {
	await IssuerService.callback(callbackUrl, did, token, { status, expireOn, blockHash, messageError });
};

const handleError = async (err, dataError) => {
	console.log(err);
	const messageError = err.message || err;
	exCallback({ ...dataError, messageError });
};

const funcToDone = async (next, data, statusError) => {
	try {
		const { blockHash, expireOn } = await next(data);
		exCallback({ ...data, status: DONE, expireOn, blockHash });
	} catch (error) {
		handleError(error, { ...data, status: statusError });
	}
};

const createAction = data => funcToDone(async ({ did, name }) => await IssuerService.addIssuer(did, name), data, ERROR);

const refreshAction = data => funcToDone(async ({ did }) => await IssuerService.refresh(did), data, ERROR_RENEW);

const revokeAction = async data => {
	try {
		await BlockchainService.revokeDelegate(data.did);
		exCallback({ ...data, status: REVOKE_STATUS });
	} catch (error) {
		console.log(error);
		handleError(error, { ...data, status: ERROR });
	}
};

exports.actions = {
	[CREATE]: createAction,
	[REVOKE]: revokeAction,
	[REFRESH]: refreshAction
};
