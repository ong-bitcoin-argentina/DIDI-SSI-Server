const router = require("express").Router();

const MailService = require("../services/MailService");
const ResponseHandler = require("./utils/ResponseHandler");
const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

/*
	Validación del email. El usuario debe envia su mail personal para poder
	generar una validación a través del envio de un correo electronico. retorna result =
	SUCCESS, en casi de ser.
*/
router.post(
	"/sendMailValidator",
	Validator.validateBody([
		{ name: "timeStamp", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_DATE_TIME] },
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const timeStamp = req.body.timeStamp;
		const eMail = req.body.eMail;
		const did = req.body.did;

		// TODO obtener codigo
		const code = "123456";

		MailService.create(
			eMail,
			code,
			did,
			timeStamp,
			function(_) {
				MailService.sendValidationCode(
					eMail,
					code,
					function(_) {
						return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
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
	Validación del código de 6 digitos enviado por Mail. El usuario debe envia
	su el código de validacion. retorna result = SUCCESS en caso de una validación
	correcta del código.
*/
router.post(
	"/verifyMailCode",
	Validator.validateBody([
		{ name: "validationCode", validate: [Constants.VALIDATION_TYPES.IS_STRING], length: { min: 6, max: 6 } },
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "timeStamp", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_DATE_TIME] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const timeStamp = req.body.timeStamp;
		const validationCode = req.body.validationCode;
		const eMail = req.body.eMail;

		MailService.validateMail(
			eMail,
			validationCode,
			timeStamp,
			function(_) {
				return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.MATCHED);
			},
			function(err) {
				return ResponseHandler.sendErr(res, err);
			}
		);
	}
);

router.post(
	"/isVerifiedMail",
	Validator.validateBody([
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const did = req.body.did;
		const eMail = req.body.eMail;

		MailService.isValidated(
			eMail,
			did,
			function(validated) {
				return ResponseHandler.sendRes(
					res,
					validated ? Messages.EMAIL.SUCCESS.VALIDATED : Messages.EMAIL.SUCCESS.NOT_VALIDATED
				);
			},
			function(err) {
				return ResponseHandler.sendErr(res, err);
			}
		);
	}
);

module.exports = router;
