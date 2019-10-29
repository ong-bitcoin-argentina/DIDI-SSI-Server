const router = require("express").Router();

const ResponseHandler = require("./utils/ResponseHandler");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const Validator = require("./utils/Validator");

/*

*/
router.post(
	"/registerUser",
	Validator.validateBody([
		{ name: "userMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "userPass", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{
			name: "phoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE],
			optional: true
		},
		{ name: "deviceAddr", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{ name: "userDID", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{ name: "pubKey", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{ name: "privKey", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{ name: "seedRecovery", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{ name: "timeStamp", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_DATE_TIME] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const pubKey = req.body.pubKey;
		const privKey = req.body.privKey;
		const seedRecovery = req.body.seedRecovery;

		const userMail = req.body.userMail;
		const userPass = req.body.userPass;
		const phoneNumber = req.body.phoneNumber;

		const deviceAddr = req.body.deviceAddr;
		const userDID = req.body.userDID;
		const timeStamp = req.body.timeStamp;

		return ResponseHandler.sendRes(res, "TODO");

		/*
		return ResponseHandler.sendRes(res,  Messages.USER.SUCCESS.REGISTERED);
		return ResponseHandler.sendErr(res, Messages.USER.ERR.COMMUNICATION_ERROR);
		return ResponseHandler.sendErr(res, Messages.USER.ERR.USER_ALREADY_EXIST);
		*/
	}
);

/*

*/
router.post(
	"/recoveryCredentials",
	Validator.validateBody([
		{ name: "userMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "userPass", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "pubKey", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const userMail = req.body.userMail;
		const userPass = req.body.userPass;
		const did = req.body.did;
		const pubKey = req.body.pubKey;

		return ResponseHandler.sendRes(res, "TODO");

		/*
		return ResponseHandler.sendRes(res,  Messages.USER.SUCCESS.RECOVERED);
		return ResponseHandler.sendErr(res, Messages.USER.ERR.COMMUNICATION_ERROR);
		*/
	}
);

/*

*/
router.post(
	"/userLogin",
	Validator.validateBody([
		{ name: "userMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "userPass", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const userMail = req.body.userMail;
		const userPass = req.body.userPass;

		return ResponseHandler.sendRes(res, "TODO");
		/*
		return ResponseHandler.sendRes(res,  { userDID, pubKey, privKey, Credntials , encriptedCredential, timeStamp, credentialTemplate} );
		return ResponseHandler.sendErr(res, Messages.USER.ERR.COMMUNICATION_ERROR);
		return ResponseHandler.sendErr(res, Messages.USER.ERR.INVALID_USER);
		return ResponseHandler.sendErr(res, Messages.USER.ERR.NOMATCH_USER_DID);
		*/
	}
);

/*
var UserService = require("../services/UserService");

router.get("/user/all", function(_, res) {
	return UserService.getAll(
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.get("/user/:userId", function(req, res) {
	const userId = req.params.userId;

	return UserService.get(
		userId,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.post("/user", function(req, res) {
	const name = req.body.user.name;
	const pass = req.body.user.pass;

	return UserService.create(
		name,
		pass,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.post("/user/login", function(req, res) {
	const name = req.body.user.name;
	const pass = req.body.user.pass;

	return UserService.login(
		name,
		pass,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.put("/user/:userId", function(req, res) {
	const name = req.body.user.name;
	const userId = req.params.userId;

	return UserService.edit(
		userId,
		name,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.delete("/user/:userId", function(req, res) {
	let userId = req.params.userId;

	return UserService.delete(
		userId,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});
*/
module.exports = router;
