const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const SmsService = require("../services/SmsService");
const UserService = require("../services/UserService");
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
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH },
			optional: true
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const phoneNumber = req.body.cellPhoneNumber;
		const did = req.body.did;
		const password = req.body.password;

		try {
			if (password && did) {
				// se ingresò contraseña, validarla
				await UserService.getAndValidate(did, password);
			}
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

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

		try {
			// validar que no existe un usuario con ese mail
			const user = await UserService.getByTel(cellPhoneNumber);
			if (user) return ResponseHandler.sendErr(res, Messages.SMS.ERR.ALREADY_EXISTS);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

		let phone;
		try {
			// validar codigo y actualizar pedido de validacion de tel
			phone = await SmsService.validatePhone(cellPhoneNumber, validationCode, did);
			if (!phone) return ResponseHandler.sendErr(res, Messages.SMS.ERR.NO_SMSCODE_MATCH);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

		try {
			// generar certificado validando que ese did le corresponde al dueño del telèfono
			let cert = await CertificateService.createPhoneCertificate(did, phone.phoneNumber);
			await CertificateService.verifyCertificate(cert);

			// mandar certificado a mouro
			await CertificateService.saveCertificate(cert);

			return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.MATCHED(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
