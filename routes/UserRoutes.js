const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const UserService = require("../services/UserService");
const MailService = require("../services/MailService");

const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const Validator = require("./utils/Validator");

/*

*/
router.post(
	"/registerUser",
	Validator.validateBody([
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
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
		const eMail = req.body.eMail;
		const password = req.body.password;
		const phoneNumber = req.body.phoneNumber;

		const did = req.body.did;
		const privateKeySeed = req.body.privateKeySeed;

		return UserService.create(
			did,
			privateKeySeed,
			eMail,
			phoneNumber,
			password,
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
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const did = req.body.did;
		const userEmail = req.body.eMail;
		const password = req.body.password;

		return UserService.login(
			did,
			userEmail,
			password,
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
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const eMail = req.body.eMail;
		const password = req.body.password;

		return UserService.recoverAccount(
			eMail,
			password,
			function(seed) {
				return ResponseHandler.sendRes(res, { privateKeySeed: seed });
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
	"/changePassword",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{
			name: "oldPass",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "newPass",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const did = req.body.did;
		const eMail = req.body.eMail;
		const oldPass = req.body.oldPass;
		const newPass = req.body.newPass;

		return UserService.changePassword(
			did,
			eMail,
			oldPass,
			newPass,
			function(_) {
				return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
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
	"/recoverPassword",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{
			name: "eMailValidationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{
			name: "newPass",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const did = req.body.did;
		const eMail = req.body.eMail;
		const eMailValidationCode = req.body.eMailValidationCode;
		const newPass = req.body.newPass;

		return MailService.validateMail(
			did,
			eMailValidationCode,
			function(_) {
				return UserService.recoverPassword(
					did,
					eMail,
					newPass,
					function(_) {
						return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
					},
					function(err) {
						return ResponseHandler.sendErr(res, err);
					}
				);
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
	"/changePhoneNumber",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{
			name: "newPhoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE]
		}
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const did = req.body.did;
		const eMail = req.body.eMail;
		const password = req.body.password;
		const newPhoneNumber = req.body.newPhoneNumber;

		return UserService.changePhoneNumber(
			did,
			password,
			eMail,
			newPhoneNumber,
			function(_) {
				return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
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
	"/changeEmail",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "newEMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const did = req.body.did;
		const eMail = req.body.eMail;
		const password = req.body.password;
		const newEMail = req.body.newEMail;

		return UserService.changeEmail(
			did,
			password,
			eMail,
			newEMail,
			function(_) {
				return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_EMAIL);
			},
			function(err) {
				return ResponseHandler.sendErr(res, err);
			}
		);
	}
);

module.exports = router;
