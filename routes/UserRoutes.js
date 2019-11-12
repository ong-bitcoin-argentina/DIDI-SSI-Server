const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const UserService = require("../services/UserService");
const MailService = require("../services/MailService");
const SmsService = require("../services/SmsService");
const CertificateService = require("../services/CertificateService");

const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const Validator = require("./utils/Validator");

/*
	Generaciòn de usuario con su backup ('privateKeySeed') para recuperar la cuenta de didi,
	tanto el mail como el telèfono tienen que haber sido validados previamente con "/verifySmsCode" y "/verifyMailCode"
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
	async function(req, res) {
		const eMail = req.body.eMail;
		const password = req.body.password;
		const phoneNumber = req.body.phoneNumber;

		const did = req.body.did;
		const privateKeySeed = req.body.privateKeySeed;

		try {
			// chequear que el mail haya sido validado
			let mailValidated = await MailService.isValidated(did, eMail);
			if (!mailValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.MAIL_NOT_VALIDATED);
		} catch (err) {
			return ResponseHandler.sendErr(res, Messages.USER.ERR.COMMUNICATION_ERROR);
		}

		try {
			// chequear que el tel haya sido validado
			let phoneValidated = await SmsService.isValidated(did, phoneNumber);
			if (!phoneValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.PHONE_NOT_VALIDATED);
		} catch (err) {
			return ResponseHandler.sendErr(res, Messages.USER.ERR.COMMUNICATION_ERROR);
		}

		try {
			// crear usuario
			let user = await UserService.create(did, privateKeySeed, eMail, phoneNumber, password);
			if (!user) return ResponseHandler.sendErr(res, Messages.USER.ERR.USER_ALREADY_EXIST);

			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.REGISTERED);
		} catch (err) {
			return ResponseHandler.sendErr(res, Messages.USER.ERR.COMMUNICATION_ERROR);
		}
	}
);

/*
	Valida que la contraseña se corresponda con la del usuario que tiene el did ingresado,
	no genera ningùn token ni informaciòn ùtil.
*/
router.post(
	"/userLogin",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const password = req.body.password;

		try {
			// validar la contraseña y retornar un boolean
			await UserService.login(did, password);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.LOGGED_IN);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
	Retorna la clave privada que sirve para recuperar la cuenta de didi.
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
	async function(req, res) {
		const eMail = req.body.eMail;
		const password = req.body.password;

		try {
			// compara contraseña y retorna clave privada
			const seed = await UserService.recoverAccount(eMail, password);
			return ResponseHandler.sendRes(res, { privateKeySeed: seed });
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
	Permite cambiar la contarseña del usuario en el caso que el usuario conoce el mail y contraseña anterior.
*/
router.post(
	"/changePassword",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
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
	async function(req, res) {
		const did = req.body.did;
		const oldPass = req.body.oldPass;
		const newPass = req.body.newPass;

		try {
			// validar contraseña y actualizarla
			await UserService.changePassword(did, oldPass, newPass);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
	Permite cambiar la contraseña a partir de la cuènta de mail asociada al usuario (caso, me olvidè la contraseña),
	require que se haya mandado un còdigo de validaciòn con "/sendMailValidator" antes de usarse.
*/
router.post(
	"/recoverPassword",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
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
	async function(req, res) {
		const did = req.body.did;
		const eMailValidationCode = req.body.eMailValidationCode;
		const newPass = req.body.newPass;

		try {
			// validar codigo y actualizar pedido de validacion de mail
			const mail = await MailService.validateMail(did, eMailValidationCode);
			if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

		try {
			// actualizar contraseña
			await UserService.recoverPassword(did, newPass);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
	Permite cambiar el nùmero de tel asociado al usuario,
	require que se haya mandado un còdigo de validaciòn con "/sendSmsValidator" antes de usarse.
*/
router.post(
	"/changePhoneNumber",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "phoneValidationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{
			name: "newPhoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE]
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const phoneValidationCode = req.body.phoneValidationCode;
		const newPhoneNumber = req.body.newPhoneNumber;

		try {
			// validar codigo y actualizar pedido de validacion de tel
			const phone = await SmsService.validatePhone(did, phoneValidationCode);
			if (!phone) return ResponseHandler.sendErr(res, Messages.SMS.ERR.NO_SMSCODE_MATCH);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

		try {
			// actualizar tel
			await UserService.changePhoneNumber(did, newPhoneNumber);

			const subject = {
				phoneCredential: {
					phoneNumber: newPhoneNumber
				}
			};

			// generar certificado validando que ese did le corresponde al dueño del telèfono
			let cert = await CertificateService.createCertificate(did, subject);

			// mandar certificado a mouro
			await CertificateService.saveCertificate(cert);

			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PHONE(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
	Permite cambiar el mail asociado al usuario,
	require que se haya mandado un còdigo de validaciòn con "/sendMailValidator" antes de usarse.
*/
router.post(
	"/changeEmail",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "eMailValidationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{ name: "newEMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const eMailValidationCode = req.body.eMailValidationCode;
		const newEMail = req.body.newEMail;

		try {
			// validar codigo y actualizar pedido de validacion de mail
			const mail = await MailService.validateMail(did, eMailValidationCode);
			if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

		try {
			// actualizar mail
			await UserService.changeEmail(did, newEMail);

			const subject = {
				emailCredential: {
					email: newEMail
				}
			};

			// generar certificado validando que ese did le corresponde al dueño del telèfono
			let cert = await CertificateService.createCertificate(did, subject);

			// mandar certificado a mouro
			await CertificateService.saveCertificate(cert);

			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_EMAIL(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
