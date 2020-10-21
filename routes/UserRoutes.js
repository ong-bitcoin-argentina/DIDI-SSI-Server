const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");
const Certificate = require("../models/Certificate");

const UserService = require("../services/UserService");
const MailService = require("../services/MailService");
const SmsService = require("../services/SmsService");
const MouroService = require("../services/MouroService");
const CertService = require("../services/CertService");
const FirebaseService = require("../services/FirebaseService");

const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const Validator = require("./utils/Validator");
const { userDTO } = require("./utils/DTOs");
const { validateAppOrUserJWT } = require("../middlewares/ValidateAppOrUserJWT");

const { IS_STRING, IS_EMAIL, IS_PASSWORD, IS_MOBILE_PHONE } = Constants.VALIDATION_TYPES;

router.use("/user/", validateAppOrUserJWT);

/**
 *	Generaciòn de usuario con su backup ('privateKeySeed') para recuperar la cuenta de didi,
 *	tanto el mail como el telèfono tienen que haber sido validados previamente con "/verifySmsCode" y "/verifyMailCode"
 */
router.post(
	"/registerUser",
	Validator.validateBody([
		{ name: "eMail", validate: [IS_STRING, IS_EMAIL] },
		{ name: "name", validate: [IS_STRING] },
		{ name: "lastname", validate: [IS_STRING] },
		{
			name: "password",
			validate: [IS_STRING, IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "phoneNumber",
			validate: [IS_STRING, IS_MOBILE_PHONE]
		},
		{ name: "did", validate: [IS_STRING] },
		{ name: "privateKeySeed", validate: [IS_STRING] },
		{
			name: "firebaseId",
			validate: [IS_STRING],
			optional: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const { password, phoneNumber, did, privateKeySeed, name, lastname } = req.body;
		const eMail = req.body.eMail.toLowerCase();
		const firebaseId = req.body.firebaseId ? req.body.firebaseId : "";

		try {
			await UserService.emailTaken(eMail);
			await UserService.telTaken(phoneNumber);

			// chequear que el mail haya sido validado
			let mailValidated = await MailService.isValidated(did, eMail);
			if (!mailValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.MAIL_NOT_VALIDATED);

			// chequear que el tel haya sido validado
			let phoneValidated = await SmsService.isValidated(did, phoneNumber);
			if (!phoneValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.PHONE_NOT_VALIDATED);

			// crear usuario
			await UserService.create(did, privateKeySeed, eMail, phoneNumber, password, firebaseId, name, lastname);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.REGISTERED);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Renueva el token de firebase
 */
router.post(
	"/renewFirebaseToken",
	Validator.validateBody([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_AUTH_TOKEN]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const did = req.context.tokenData.iss;
		const firebaseId = req.context.tokenData.firebaseId;

		try {
			//renueva el firebaseId
			const user = await UserService.getByDID(did);
			if (!user) return ResponseHandler.sendErr(res, Messages.USER.ERR.GET);

			await user.updateFirebaseId(firebaseId);
			return ResponseHandler.sendRes(res, { firebaseId: user.firebaseId });
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Retorna la clave privada que sirve para recuperar la cuenta de didi.
 */
router.post(
	"/recoverAccount",
	Validator.validateBody([
		{ name: "eMail", validate: [IS_STRING, IS_EMAIL] },
		{
			name: "password",
			validate: [IS_STRING, IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "firebaseId",
			validate: [IS_STRING],
			optional: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const eMail = req.body.eMail.toLowerCase();
		const password = req.body.password;
		const firebaseId = req.body.firebaseId ? req.body.firebaseId : "";

		try {
			// compara contraseña y retorna clave privada
			const seed = await UserService.recoverAccount(eMail, password, firebaseId);
			return ResponseHandler.sendRes(res, { privateKeySeed: seed });
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Valida que la contraseña se corresponda con la del usuario que tiene el did ingresado,
 *	no genera ningùn token ni informaciòn ùtil.
 */
router.post(
	"/userLogin",
	Validator.validateBody([
		{ name: "did", validate: [IS_STRING] },
		{
			name: "password",
			validate: [IS_STRING, IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{ name: "eMail", validate: [IS_STRING, IS_EMAIL] },
		{
			name: "firebaseId",
			validate: [IS_STRING],
			optional: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const did = req.body.did;
		const password = req.body.password;
		const eMail = req.body.eMail.toLowerCase();
		const firebaseId = req.body.firebaseId;

		try {
			// validar la contraseña y retornar un boolean
			const user = await UserService.login(did, eMail, password);
			if (firebaseId) await user.updateFirebaseId(firebaseId);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.LOGGED_IN);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Permite cambiar la contraseña a partir de la cuènta de mail asociada al usuario (caso, me olvidè la contraseña),
 *	require que se haya mandado un còdigo de validaciòn con "/sendMailValidator" antes de usarse.
 */
router.post(
	"/recoverPassword",
	Validator.validateBody([
		{ name: "eMail", validate: [IS_STRING, IS_EMAIL] },
		{
			name: "eMailValidationCode",
			validate: [IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{
			name: "newPass",
			validate: [IS_STRING, IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
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

/**
 *	Permite cambiar la contarseña del usuario en el caso que el usuario conoce el mail y contraseña anterior.
 */
router.post(
	"/changePassword",
	Validator.validateBody([
		{ name: "did", validate: [IS_STRING] },
		{
			name: "oldPass",
			validate: [IS_STRING, IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "newPass",
			validate: [IS_STRING, IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
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

/**
 *	Permite cambiar el nùmero de tel asociado al usuario,
 *	require que se haya mandado un còdigo de validaciòn con "/sendSmsValidator" antes de usarse.
 */
router.post(
	"/changePhoneNumber",
	Validator.validateBody([
		{ name: "did", validate: [IS_STRING] },
		{
			name: "newPhoneNumber",
			validate: [IS_STRING, IS_MOBILE_PHONE]
		},
		{
			name: "password",
			validate: [IS_STRING, IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "phoneValidationCode",
			validate: [IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{
			name: "firebaseId",
			validate: [IS_STRING],
			optional: true
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const did = req.body.did;
		const phoneValidationCode = req.body.phoneValidationCode;
		const newPhoneNumber = req.body.newPhoneNumber;
		const password = req.body.password;
		const firebaseId = req.body.firebaseId ? req.body.firebaseId : "";

		try {
			// validar telefono nuevo en uso
			await UserService.telTaken(newPhoneNumber, did);

			// validar codigo
			let phone = await SmsService.isValid(newPhoneNumber, phoneValidationCode);

			// generar certificado validando que ese did le corresponde al dueño del telèfono
			let cert = await CertService.createPhoneCertificate(did, newPhoneNumber);
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

			// actualizar tel
			await UserService.changePhoneNumber(did, newPhoneNumber, password, firebaseId);

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

/**
 *	Permite cambiar el mail asociado al usuario,
 *	require que se haya mandado un còdigo de validaciòn con "/sendMailValidator" antes de usarse.
 */
router.post(
	"/changeEmail",
	Validator.validateBody([
		{ name: "did", validate: [IS_STRING] },

		{ name: "newEMail", validate: [IS_STRING, IS_EMAIL] },
		{
			name: "password",
			validate: [IS_STRING, IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "eMailValidationCode",
			validate: [IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const did = req.body.did;
		const eMailValidationCode = req.body.eMailValidationCode;
		const newEMail = req.body.newEMail.toLowerCase();
		const password = req.body.password;

		try {
			// validar mail nuevo en uso
			await UserService.emailTaken(newEMail, did);

			// validar codigo
			let mail = await MailService.isValid(newEMail, eMailValidationCode);
			if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);

			// generar certificado validando que ese did le corresponde al dueño del mail
			let cert = await CertService.createMailCertificate(did, newEMail);
			await CertService.verifyCertificateEmail(cert);

			// revocar certificado anterior
			const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.EMAIL);
			for (let elem of old) {
				elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
				const jwt = await elem.getJwt();
				await MouroService.revokeCertificate(jwt, elem.hash, did);
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

/**
 *	Permite pedir al usuario dueño del did, el certificado para validar que es efectivamente el dueño del mismo
 *	(genera un shareRequest y lo envia via mouro para que el usuario valide el certificado)
 */
router.post(
	"/verifyCredentialRequest",
	Validator.validateBody([
		{ name: "did", validate: [IS_STRING] },
		{ name: "jwt", validate: [IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const did = req.body.did;
		const jwt = req.body.jwt;

		try {
			const decoded = await CertService.decodeCertificate(jwt, Messages.CERTIFICATE.ERR.VERIFY);
			const name = Object.keys(decoded.payload.vc.credentialSubject)[0];

			const cb = Constants.ADDRESS + ":" + Constants.PORT + "/api/1.0/didi/verifyCredential";
			const claims = {
				verifiable: {
					[name]: {
						jwt: jwt,
						essential: true
					}
				}
			};

			const petition = await CertService.createPetition(did, claims, cb);

			try {
				// enviar push notification
				const user = await UserService.getByDID(did);
				await FirebaseService.sendPushNotification(
					Messages.PUSH.VALIDATION_REQ.TITLE,
					Messages.PUSH.VALIDATION_REQ.MESSAGE,
					user.firebaseId,
					Messages.PUSH.TYPES.VALIDATION_REQ
				);
			} catch (err) {
				console.log("Error sending push notifications:");
				console.log(err);
			}

			const result = await MouroService.saveCertificate(petition, did);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Recibe la respuesta al pedido de '/verifyCredentialRequest', marcando al certificado como validado
 */
router.post(
	"/verifyCredential",
	Validator.validateBody([{ name: "access_token", validate: [IS_STRING] }]),
	Validator.checkValidationResult,
	async function (req, res) {
		const access_token = req.body.access_token;

		const data = await CertService.decodeCertificate(access_token, Messages.CERTIFICATE.ERR.VERIFY);
		const jwt = data.payload.verified[0];

		try {
			// valido que el certificado este en mouro
			const hash = await MouroService.isInMouro(jwt, data.payload.iss, Messages.ISSUER.ERR.NOT_FOUND);
			if (!hash) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.NOT_FOUND);

			// obtengo el certificado
			const cert = await Certificate.findByHash(hash);
			const certDid = await cert.getDid();
			// valido que el emisor sea el correcto
			if (certDid !== data.payload.iss) return ResponseHandler.sendErr(res, Messages.USER.ERR.VALIDATE_DID_ERROR);

			const certJwt = await cert.getJwt();
			// decodifico jwt
			const decoded = await CertService.decodeCertificate(certJwt, Messages.CERTIFICATE.ERR.VERIFY);

			const credData = decoded.payload.vc.credentialSubject;
			const certCategory = Object.keys(credData)[0];
			const wrappedIndex = Object.keys(credData[certCategory]).indexOf("wrapped");
			if (wrappedIndex >= 0) {
				// de haberlas, marco microcredenciales como validadas
				for (let key of Object.keys(credData[certCategory].wrapped)) {
					const hash = await MouroService.isInMouro(
						credData[certCategory].wrapped[key],
						data.payload.iss,
						Messages.ISSUER.ERR.NOT_FOUND
					);
					if (!hash) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.NOT_FOUND);

					const microCert = await Certificate.findByHash(hash);
					microCert.update(Constants.CERTIFICATE_STATUS.VERIFIED);
				}
			}
			// marco macrocredencial como validada
			cert.update(Constants.CERTIFICATE_STATUS.VERIFIED);
			return ResponseHandler.sendRes(res, {});
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Obtiene informacion sobre el usuario
 */
router.post(
	"/user/:did",
	Validator.checkValidationResult,
	Validator.validateParams,
	async function (req, res) {
		try {
			const { did } = req.params;
			const user = await UserService.findByDid(did);
			const result = await userDTO(user);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Edita nombre y apellido, usado para migrar usuarios
 */
router.post(
	"/user/:did/edit",
	Validator.validateBody([
		{ name: "name", validate: [IS_STRING] },
		{ name: "lastname", validate: [IS_STRING] }
	]),
	Validator.checkValidationResult,
	Validator.validateParams,
	async function (req, res) {
		try {
			const { did } = req.params;
			const { name, lastname } = req.body;
			const result = await UserService.findByDidAndUpdate(did, { name, lastname });
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErrWithStatus(res, err);
		}
	}
);

module.exports = router;
