const router = require("express").Router();

const ResponseHandler = require("./utils/ResponseHandler");
const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

/*
	Validación de teléfono. El usuario debe envia su numero de celular para
	poder generar una validación a través de SMS. retorna result = SUCCES S, en casi de ser.
*/
router.post(
	"/sendSmsValidator",
	Validator.validateBody([
		{
			name: "cellPhoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE]
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const phone = req.body.cellPhoneNumber;
		const did = req.body.did;
		
		return ResponseHandler.sendRes(res, "TODO");

		/*
		return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.SENT);
		return ResponseHandler.sendErr(res, Messages.SMS.ERR.COMMUNICATION_ERROR);
		*/
	}
);

/* 
	Validación del código de 6 digitos enviado por SMS. El usuario debe envia
	su el código de validacion. retorna result = SUCCESS en caso de una validación
	correcta del código.
*/
router.post(
	"/verifySmsCode",
	Validator.validateBody([
		{ name: "validationCode", validate: [Constants.VALIDATION_TYPES.IS_STRING], length: { min: 6, max: 6 } },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	function(req, res) {
		const validationCode = req.body.validationCode;
		const did = req.body.did;

		return ResponseHandler.sendRes(res, "TODO");

		/*
		return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.MATCHED);
		return ResponseHandler.sendErr(res, Messages.SMS.ERR.COMMUNICATION_ERROR);
		return ResponseHandler.sendErr(res, Messages.SMS.ERR.NO_SMSCODE_MATCH);
		*/
	}
);

module.exports = router;
