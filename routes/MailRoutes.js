const router = require("express").Router();

const ResponseHandler = require("./utils/ResponseHandler");
const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

var mailgun = require("mailgun-js")({ apiKey: Constants.MAILGUN_API_KEY, domain: Constants.MAILGUN_DOMAIN });

/*
	Validación del email. El usuario debe envia su mail personal para poder
	generar una validación a través del envio de un correo electronico. retorna result =
	SUCCESS, en casi de ser.
*/
router.post(
	"/sendMailValidator",
	Validator.validateBody([
		{ name: "timeStamp", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_DATE_TIME] },
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const timeStamp = req.body.timeStamp;
		const eMail = req.body.eMail;

		const data = {
			from: Messages.EMAIL.VALIDATION.FROM,
			to: eMail,
			subject: Messages.EMAIL.VALIDATION.SUBJECT,
			text: Messages.EMAIL.VALIDATION.MESSAGE("123456")
		};

		mailgun.messages().send(data, (error, body) => {
			if (error) {
				console.log(error);
				return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.COMMUNICATION_ERROR);
			}
			return ResponseHandler.sendRes(res, "");
		});

		// "SUCCESS"
		// "COMMUNICATION_ERROR"
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
		{ name: "timeStamp", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_DATE_TIME] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const validationCode = req.body.validationCode;
		const did = req.body.did;

		return ResponseHandler.sendRes(res, "TODO");
		// "EMAILCODE_MATCH"
		// "COMMUNICATION_ERROR" / "NO_EMAILCODE_MATCH"
	}
);

module.exports = router;
