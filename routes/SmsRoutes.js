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
	poder generar una validación a través de SMS.
	Si el did ya tiene un usuario asociado, se requiere el ingreso de la contraseña para dicho usuario.
*/
router.post(
	"/sendSmsValidator",
	Validator.validateBody([
		{
			name: "cellPhoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const phoneNumber = req.body.cellPhoneNumber;

		// generar còdigo de validacion
		let code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
		if (Constants.DEBUGG) console.log(code);

		try {
			// crear y guardar pedido de validacion de tel
			await SmsService.create(phoneNumber, code, undefined);

			// mandar sms con còdigo de validacion
			await SmsService.sendValidationCode(phoneNumber, code);

			return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.SENT);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/* 
	Validación del código de 6 digitos enviado por SMS.  El usuario debe ingresar
	su el código de validacion, el cuàl debe haberse mandado previamènte con "/sendSmsValidator".
*/
router.post(
	"/verifySmsCode",
	Validator.validateBody([
		{
			name: "cellPhoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE]
		},		
		{
			name: "validationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const cellPhoneNumber = req.body.cellPhoneNumber;
		const validationCode = req.body.validationCode;
		const did = req.body.did;

		let phone;
		try {
			// validar codigo y actualizar pedido de validacion de tel
			phone = await SmsService.validatePhone(cellPhoneNumber, validationCode, did);
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
			// generar certificado validando que ese did le corresponde al dueño del telèfono
			let cert = await CertificateService.createCertificate(did, subject);

			// mandar certificado a mouro
			await CertificateService.saveCertificate(cert);

			return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.MATCHED(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
