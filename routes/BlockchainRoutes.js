const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const BlockchainService = require("../services/BlockchainService");
const Constants = require("../constants/Constants");
const Validator = require("./utils/Validator");

/*

*/
router.post(
	"/eth/delegateDid",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "privateKey", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "didDelegate", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const didDelegate = req.body.didDelegate;
		const privateKey = req.body.privateKey;

		try {
			await BlockchainService.addDelegate(did, { from: did, key: privateKey }, didDelegate);
			return ResponseHandler.sendRes(res, {});
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*

*/
router.post(
	"/eth/didDelegationValid",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "didDelegate", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const didDelegate = req.body.didDelegate;

		try {
			const result = await BlockchainService.validDelegate(did, { from: did }, didDelegate);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*

*/
router.delete(
	"/eth/removeDidDelegation",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "privateKey", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "didDelegate", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const didDelegate = req.body.didDelegate;
		const privateKey = req.body.privateKey;

		try {
			await BlockchainService.removeDelegate(did, { from: did, key: privateKey }, didDelegate);
			return ResponseHandler.sendRes(res, {});
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;