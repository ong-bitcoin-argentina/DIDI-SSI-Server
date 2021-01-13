const Constants = require("../constants/Constants");
const IssuerService = require("../services/IssuerService");
const { ERROR, DONE, ERROR_RENEW } = Constants.STATUS;
const { CREATE, REFRESH, REVOKE } = Constants.DELEGATE_ACTIONS;

const exCallback = async ({ callbackUrl, did, token, status = ERROR, expireOn, blockHash, messageError }) => {
	await IssuerService.callback(callbackUrl, did, token, { status, expireOn, blockHash, messageError });
};

const catchError = async (next, dataError) => {
	try {
		await next();
	} catch (err) {
		console.log(err);
		const messageError = err.message ? err.message : err;
		exCallback({ ...dataError, messageError });
	}
};

const funcToDone = (next, data, statusError) => {
	catchError(
		async () => {
			const { blockHash, expireOn } = await next(data);
			exCallback({ ...data, status: DONE, expireOn, blockHash });
		},
		{ ...data, status: statusError }
	);
};

const createAction = data => {
	funcToDone(async ({ did, name }) => await IssuerService.addIssuer(did, name), data, ERROR);
};

const refreshAction = data => {
	funcToDone(async ({ did }) => await IssuerService.refresh(did), data, ERROR_RENEW);
};

const revokeAction = async ({ did }) => {
	try {
		await BlockchainService.revokeDelegate(did);
	} catch (err) {
		console.log(err);
	}
};

exports.actions = {
	[CREATE]: createAction,
	[REVOKE]: revokeAction,
	[REFRESH]: refreshAction
};
