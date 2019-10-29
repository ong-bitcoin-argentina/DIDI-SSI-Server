const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const UserService = require("../services/UserService");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const Validator = require("./utils/Validator");

/*

*/
router.post(
	"/registerUser",
	Validator.validateBody([
		{ name: "userMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "userPass", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "phoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE],
			optional: true
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "privateKeySeed", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const userMail = req.body.userMail;
		const userPass = req.body.userPass;
		const phoneNumber = req.body.phoneNumber;

		const did = req.body.did;
		const privateKeySeed = req.body.privateKeySeed;

		return UserService.create(
			did,
			privateKeySeed,
			userMail,
			phoneNumber,
			userPass,
			function(user) {
				if (!user) return ResponseHandler.sendErr(res, Messages.USER.ERR.USER_ALREADY_EXIST);
				return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.REGISTERED);
			},
			function(err) {
				return ResponseHandler.sendErr(res, Messages.USER.ERR.COMMUNICATION_ERROR);
			}
		);
	}
);

/*

*/
router.post(
	"/userLogin",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "userPass", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "userEmail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const did = req.body.did;
		const userEmail = req.body.userEmail;
		const userPass = req.body.userPass;

		return UserService.login(
			did,
			userEmail,
			userPass,
			function(result) {
				return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.LOGGED_IN);
			},
			function(err) {
				return ResponseHandler.sendErr(res, err);
			}
		);
	}
);

/*

*/
router.post(
	"/recoverAccount",
	Validator.validateBody([
		{ name: "userMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "userPass", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const userMail = req.body.userMail;
		const userPass = req.body.userPass;

		return UserService.recoverAccount(
			userMail,
			userPass,
			function(seed) {
				return ResponseHandler.sendRes(res, { privateKeySeed: seed });
			},
			function(err) {
				return ResponseHandler.sendErr(res, err);
			}
		);
	}
);

module.exports = router;
