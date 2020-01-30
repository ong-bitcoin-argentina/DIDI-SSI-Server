const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");
const Certificate = require("../models/Certificate");

const UserService = require("../services/UserService");
const MailService = require("../services/MailService");
const SmsService = require("../services/SmsService");
const MouroService = require("../services/MouroService");

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
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE]
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "privateKeySeed", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const eMail = req.body.eMail.toLowerCase();
		const password = req.body.password;
		const phoneNumber = req.body.phoneNumber;

		const did = req.body.did;
		const privateKeySeed = req.body.privateKeySeed;

		try {
			// chequear que el mail haya sido validado
			let mailValidated = await MailService.isValidated(did, eMail);
			if (!mailValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.MAIL_NOT_VALIDATED);

			// chequear que el tel haya sido validado
			let phoneValidated = await SmsService.isValidated(did, phoneNumber);
			if (!phoneValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.PHONE_NOT_VALIDATED);

			// crear usuario
			await UserService.create(did, privateKeySeed, eMail, phoneNumber, password);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.REGISTERED);
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
		const eMail = req.body.eMail.toLowerCase();
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
		},
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const password = req.body.password;
		const eMail = req.body.eMail.toLowerCase();

		try {
			// validar la contraseña y retornar un boolean
			await UserService.login(did, eMail, password);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.LOGGED_IN);
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
	async function(req, res) {
		const eMail = req.body.eMail.toLowerCase();
		const eMailValidationCode = req.body.eMailValidationCode;
		const newPass = req.body.newPass;

		try {
			// validar codigo
			let mail = await MailService.isValid(eMail, eMailValidationCode);
			if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);

			// actualizar contraseña
			await UserService.recoverPassword(eMail, newPass);

			// actualizar pedido de validacion de mail
			console.log(await mail.getDid());

			mail = await MailService.validateMail(mail, await mail.getDid());

			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
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
	Permite cambiar el nùmero de tel asociado al usuario,
	require que se haya mandado un còdigo de validaciòn con "/sendSmsValidator" antes de usarse.
*/
router.post(
	"/changePhoneNumber",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "newPhoneNumber",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_MOBILE_PHONE]
		},
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "phoneValidationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const phoneValidationCode = req.body.phoneValidationCode;
		const newPhoneNumber = req.body.newPhoneNumber;
		const password = req.body.password;

		try {
			// validar codigo
			let phone = await SmsService.isValid(newPhoneNumber, phoneValidationCode);

			// generar certificado validando que ese did le corresponde al dueño del telèfono
			let cert = await MouroService.createPhoneCertificate(did, newPhoneNumber);
			await MouroService.verifyCertificatePhoneNumber(cert);

			// revocar certificado anterior
			const old = await Certificate.findByName(did, Constants.CERTIFICATE_NAMES.TEL);
			for (let elem of old) {
				elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
				await MouroService.revokeCertificate(elem.jwt, elem.hash, did);
			}

			// mandar certificado a mouro
			const jwt = await MouroService.saveCertificate(cert, did);

			// actualizar tel
			await UserService.changePhoneNumber(did, newPhoneNumber, password);

			// validar codigo y actualizar pedido de validacion de mail
			await Certificate.generate(
				Constants.CERTIFICATE_NAMES.TEL,
				did,
				Constants.CERTIFICATE_STATUS.UNVERIFIED,
				jwt.data,
				jwt.hash
			);
			phone = await SmsService.validatePhone(phone, did);
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

		{ name: "newEMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "eMailValidationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const eMailValidationCode = req.body.eMailValidationCode;
		const newEMail = req.body.newEMail.toLowerCase();
		const password = req.body.password;

		try {
			// validar codigo
			let mail = await MailService.isValid(newEMail, eMailValidationCode);
			if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);

			// generar certificado validando que ese did le corresponde al dueño del mail
			let cert = await MouroService.createMailCertificate(did, newEMail);
			await MouroService.verifyCertificateEmail(cert);

			// revocar certificado anterior
			const old = await Certificate.findByName(did, Constants.CERTIFICATE_NAMES.EMAIL);
			for (let elem of old) {
				elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
				await MouroService.revokeCertificate(elem.jwt, elem.hash, did);
			}

			// mandar certificado a mouro
			const jwt = await MouroService.saveCertificate(cert, did);

			// actualizar mail
			await UserService.changeEmail(did, newEMail, password);

			// validar codigo y actualizar pedido de validacion de mail
			await Certificate.generate(
				Constants.CERTIFICATE_NAMES.EMAIL,
				did,
				Constants.CERTIFICATE_STATUS.UNVERIFIED,
				jwt.data,
				jwt.hash
			);
			mail = await MailService.validateMail(mail, did);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_EMAIL(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/verifyCredentialRequest",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const jwt = req.body.jwt;

		try {
			const decoded = await MouroService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);
			const name = Object.keys(decoded.payload.vc.credentialSubject)[0];

			const cb = Constants.ADDRESS + ":" + Constants.PORT + "/api/1.0/didi/verifyCredential";
			const data = {
				callbackUrl: cb,
				claims: {
					verifiable: {
						[name]: {
							jwt: jwt,
							essential: true
						}
					}
				}
			};

			const petition = await MouroService.createPetition(did, data);
			const result = await MouroService.saveCertificate(petition, did);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/verifyCredential",
	Validator.validateBody([{ name: "access_token", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const access_token = req.body.access_token;

		const data = await MouroService.decodeCertificate(access_token, Messages.CERTIFICATE.ERR.VERIFY);
		const jwt = data.payload.verified[0];

		try {
			const cert = await Certificate.findByJwt(jwt);
			if (cert.userDID !== data.payload.iss) return ResponseHandler.sendErr(res, Messages.USER.ERR.VALIDATE_DID_ERROR);

			const decoded = await MouroService.decodeCertificate(cert.jwt, Messages.CERTIFICATE.ERR.VERIFY);

			const credData = decoded.payload.vc.credentialSubject;
			const certCategory = Object.keys(credData)[0];
			const wrappedIndex = Object.keys(credData[certCategory]).indexOf("wrapped");
			if (wrappedIndex >= 0) {
				for (let key of Object.keys(credData[certCategory].wrapped)) {
					const microCert = await Certificate.findByJwt(credData[certCategory].wrapped[key]);
					microCert.update(Constants.CERTIFICATE_STATUS.VERIFIED);
				}
			}

			cert.update(Constants.CERTIFICATE_STATUS.VERIFIED);
			return ResponseHandler.sendRes(res, {});
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
