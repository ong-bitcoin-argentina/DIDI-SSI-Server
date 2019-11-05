const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const SmsService = require("../services/SmsService");
const CertificateService = require("../services/CertificateService");

const Validator = require("./utils/Validator");
const CodeGenerator = require("./utils/CodeGenerator");
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
	async function(req, res) {
		const phoneNumber = req.body.cellPhoneNumber;
		const did = req.body.did;

		let code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
		if (Constants.DEBUGG) console.log(code);

		try {
			await SmsService.create(phoneNumber, code, did);
			await SmsService.sendValidationCode(phoneNumber, code);
			return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.SENT);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
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
		{
			name: "validationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const validationCode = req.body.validationCode;
		const did = req.body.did;

		let phone;
		try {
			phone = await SmsService.validatePhone(did, validationCode);
			if (!phone) return ResponseHandler.sendErr(res, Messages.SMS.ERR.NO_SMSCODE_MATCH);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

		const subject = {
			phoneCredential: {
				phoneNumber: phone.phoneNumber
			}
		};

		try {
			let cert = await CertificateService.createCertificate(did, subject);
			await CertificateService.saveCertificate(cert);
			return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.MATCHED(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
