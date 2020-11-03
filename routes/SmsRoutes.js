const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");
const Certificate = require("../models/Certificate");

const SmsService = require("../services/SmsService");
const UserService = require("../services/UserService");
const MouroService = require("../services/MouroService");
const CertService = require("../services/CertService");

const Validator = require("./utils/Validator");
const CodeGenerator = require("./utils/CodeGenerator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

/**
 *	Validación de teléfono. El usuario debe envia su numero de celular para
 *	poder generar una validación a través de SMS.
 *	Si el did ya tiene un usuario asociado, se requiere el ingreso de la contraseña para dicho usuario.
 */
router.post(
	"/sendSmsValidator",
	Validator.validateBody([
		{
			name: "cellPhoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE],
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH },
			optional: true,
		},
		{ name: "unique", validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN], optional: true },
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const phoneNumber = await UserService.normalizePhone(req.body.cellPhoneNumber);
		const did = req.body.did;
		const password = req.body.password;
		const unique = req.body.unique;

		try {
			// validar que el telefono no este en uso
			if (unique) await UserService.telTaken(phoneNumber);

			// se ingresò contraseña, validarla
			if (password && did) await UserService.getAndValidate(did, password);

			// generar còdigo de validacion
			let code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
			if (Constants.DEBUGG) console.log(code);

			// crear y guardar pedido de validacion de tel
			await SmsService.create(phoneNumber, code, undefined);

			// mandar sms con código de validacion
			if (Constants.NO_SMS) {
				return ResponseHandler.sendRes(res, { code });
			}

			await SmsService.sendValidationCode(phoneNumber, code);

			return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.SENT);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Validación del código de 6 digitos enviado por SMS.  El usuario debe ingresar
 *	su el código de validacion, el cuàl debe haberse mandado previamènte con "/sendSmsValidator".
 */
router.post(
	"/verifySmsCode",
	Validator.validateBody([
		{
			name: "cellPhoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE],
		},
		{
			name: "validationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH },
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const cellPhoneNumber = await UserService.normalizePhone(req.body.cellPhoneNumber);

		const validationCode = req.body.validationCode;
		const did = req.body.did;

		try {
			// validar codigo
			let phone = await SmsService.isValid(cellPhoneNumber, validationCode);

			// validar que no existe un usuario con ese mail
			const user = await UserService.getByTel(cellPhoneNumber);
			if (user) return ResponseHandler.sendErr(res, Messages.SMS.ERR.ALREADY_EXISTS);

			// generar certificado validando que ese did le corresponde al dueño del telèfono
			let cert = await CertService.createPhoneCertificate(did, cellPhoneNumber);
			await CertService.verifyCertificatePhoneNumber(cert);

			// revocar certificado anterior
			const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.TEL);
			for (let elem of old) {
				elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
				const jwt = await elem.getJwt();
				await MouroService.revokeCertificate(jwt, elem.hash, did);
			}

			// mandar certificado a mouro
			const jwt = await MouroService.saveCertificate(cert, did);

			// validar codigo y actualizar pedido de validacion de mail
			await Certificate.generate(
				Constants.CERTIFICATE_NAMES.TEL,
				did,
				Constants.CERTIFICATE_STATUS.UNVERIFIED,
				jwt.data,
				jwt.hash
			);
			phone = await SmsService.validatePhone(phone, did);
			return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.MATCHED(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
