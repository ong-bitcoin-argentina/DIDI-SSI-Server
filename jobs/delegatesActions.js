const Constants = require("../constants/Constants");
const IssuerService = require("../services/IssuerService");
const BlockchainService = require("../services/BlockchainService");
const CallbackTask = require("../models/CallbackTask");
const { ERROR, DONE, ERROR_RENEW, REVOKED } = Constants.STATUS;
const { CREATE, REFRESH, REVOKE } = Constants.DELEGATE_ACTIONS;

const handleError = async (err, dataError) => {
	console.log(err);
	const messageError = err.message || err;
	await CallbackTask.create({ ...dataError, messageError });
};

const funcToDone = async (next, data, statusError) => {
	try {
		const { blockHash, expireOn } = await next(data);
		await CallbackTask.create({ ...data, status: DONE, expireOn, blockHash });
	} catch (error) {
		handleError(error, { ...data, status: statusError });
	}
};

const createAction = data => funcToDone(async ({ did, name }) => await IssuerService.addIssuer(did, name), data, ERROR);

const refreshAction = data => funcToDone(async ({ did }) => await IssuerService.refresh(did), data, ERROR_RENEW);

const revokeAction = async data => {
	try {
		await BlockchainService.revokeDelegate(data.did);
		await CallbackTask.create({ ...data, status: REVOKED });
	} catch (error) {
		handleError(error, { ...data, status: ERROR });
	}
};

exports.actions = {
	[CREATE]: createAction,
	[REVOKE]: revokeAction,
	[REFRESH]: refreshAction
};
