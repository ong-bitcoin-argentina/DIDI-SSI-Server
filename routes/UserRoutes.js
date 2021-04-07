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
const { userDTO } = require("../utils/DTOs");
const { validateAppOrUserJWT } = require("../middlewares/ValidateAppOrUserJWT");
const { getImageUrl } = require("./utils/Helpers");
const { halfHourLimiter } = require("../policies/RateLimit");

const { IS_STRING, IS_EMAIL, IS_PASSWORD, IS_MOBILE_PHONE } = Constants.VALIDATION_TYPES;

router.use("/user/", validateAppOrUserJWT);

/**
 *	Generación de usuario con su backup ('privateKeySeed') para recuperar la cuenta de didi,
 *	tanto el mail como el teléfono tienen que haber sido validados previamente con "/verifySmsCode" y "/verifyMailCode"
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
		const { password, did, privateKeySeed, name, lastname } = req.body;
		const phoneNumber = await UserService.normalizePhone(req.body.phoneNumber);
		const eMail = req.body.eMail.toLowerCase();
		const firebaseId = req.body.firebaseId ? req.body.firebaseId : "";

		try {
			await UserService.emailTaken(eMail);
			await UserService.telTaken(phoneNumber);

			// Verificar que el mail haya sido validado
			let mailValidated = await MailService.isValidated(did, eMail);
			if (!mailValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.MAIL_NOT_VALIDATED);

			// Verificar que el teléfono haya sido validado
			let phoneValidated = await SmsService.isValidated(did, phoneNumber);
			if (!phoneValidated) return ResponseHandler.sendErr(res, Messages.USER.ERR.PHONE_NOT_VALIDATED);

			// Crear usuario
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
			// Renueva el firebaseId
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
 *	Retorna la clave privada que sirve para recuperar la cuenta de didi
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
			// Compara contraseña y retorna clave privada
			const seed = await UserService.recoverAccount(eMail, password, firebaseId);
			return ResponseHandler.sendRes(res, { privateKeySeed: seed });
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Valida que la contraseña se corresponda con la del usuario que tiene el did ingresado,
 *	no genera ningún token ni informaciún útil.
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
	halfHourLimiter,
	async function (req, res) {
		const did = req.body.did;
		const password = req.body.password;
		const eMail = req.body.eMail.toLowerCase();
		const firebaseId = req.body.firebaseId;

		try {
			// Validar la contraseña y retornar un boolean
			const user = await UserService.login(did, eMail, password);
			if (firebaseId) await user.updateFirebaseId(firebaseId);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.LOGGED_IN);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Permite cambiar la contraseña a partir de la cuenta de mail asociada al usuario (caso, me olvidé la contraseña),
 *	require que se haya validado el mail ("/sendMailValidator") antes de usarse.
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
			// Validar código
			let mail = await MailService.isValid(eMail, eMailValidationCode);
			if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);

			// Actualizar contraseña
			await UserService.recoverPassword(eMail, newPass);

			// Actualizar pedido de validación de mail
			console.log(await mail.getDid());
			mail = await MailService.validateMail(mail, await mail.getDid());

			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Renovar la contraseña, dado el mail y contraseña anterior
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
			// Validar contraseña y actualizarla
			await UserService.changePassword(did, oldPass, newPass);
			return ResponseHandler.sendRes(res, Messages.USER.SUCCESS.CHANGED_PASS);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Permite cambiar el número de teléfono asociado al usuario,
 *	require que se haya validado el teléfono ("/sendSmsValidator") antes de usarse
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
	halfHourLimiter,
	async function (req, res) {
		const did = req.body.did;
		const phoneValidationCode = req.body.phoneValidationCode;
		const newPhoneNumber = await UserService.normalizePhone(req.body.newPhoneNumber);
		const password = req.body.password;
		const firebaseId = req.body.firebaseId ? req.body.firebaseId : "";

		try {
			// Validar telefono nuevo en uso
			await UserService.telTaken(newPhoneNumber, did);

			// Validar codigo
			let phone = await SmsService.isValid(newPhoneNumber, phoneValidationCode);

			// Generar certificado validando que ese did le corresponde al dueño del teléfono
			let cert = await CertService.createPhoneCertificate(did, newPhoneNumber);
			await CertService.verifyCertificatePhoneNumber(cert);

			// Revocar certificado anterior
			const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.TEL);
			for (let elem of old) {
				elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
				const jwt = await elem.getJwt();
				await MouroService.revokeCertificate(jwt, elem.hash, did);
			}

			// mandar certificado a mouro
			const jwt = await MouroService.saveCertificate(cert, did);

			// Actualizar numero de teléfono
			await UserService.changePhoneNumber(did, newPhoneNumber, password, firebaseId);

			// Validar código y actualizar pedido de validación de mail
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
 *	require que se haya validado el mail ("/sendMailValidator") antes de usarse.
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
	halfHourLimiter,
	async function (req, res) {
		const did = req.body.did;
		const eMailValidationCode = req.body.eMailValidationCode;
		const newEMail = req.body.newEMail.toLowerCase();
		const password = req.body.password;

		try {
			// Validar mail nuevo en uso
			await UserService.emailTaken(newEMail, did);

			// Validar codigo
			let mail = await MailService.isValid(newEMail, eMailValidationCode);
			if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);

			// Generar certificado validando que ese did le corresponde al dueño del mail
			let cert = await CertService.createMailCertificate(did, newEMail);
			await CertService.verifyCertificateEmail(cert);

			// Revocar certificado anterior
			const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.EMAIL);
			for (let elem of old) {
				elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
				const jwt = await elem.getJwt();
				await MouroService.revokeCertificate(jwt, elem.hash, did);
			}

			// Mandar certificado a mouro
			const jwt = await MouroService.saveCertificate(cert, did);

			// Actualizar mail
			await UserService.changeEmail(did, newEMail, password);

			// Validar código y actualizar pedido de validación de mail
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
				// Enviar push notification
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
 *	Recibe la respuesta al pedido de "/verifyCredentialRequest", marcando al certificado como validado
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
			// Validar que el certificado este en mouro
			const hash = await MouroService.isInMouro(jwt, data.payload.iss, Messages.ISSUER.ERR.NOT_FOUND);
			if (!hash) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.NOT_FOUND);

			// Obtener el certificado según el hash de mouro
			const cert = await Certificate.findByHash(hash);
			const certDid = await cert.getDid();

			// Verificar que el emisor sea el correcto
			if (certDid !== data.payload.iss) return ResponseHandler.sendErr(res, Messages.USER.ERR.VALIDATE_DID_ERROR);

			// Obtener y decodificar jwt
			const certJwt = await cert.getJwt();
			const decoded = await CertService.decodeCertificate(certJwt, Messages.CERTIFICATE.ERR.VERIFY);

			// Si existen, se marca cada microcredencial como validada
			const credData = decoded.payload.vc.credentialSubject;
			const certCategory = Object.keys(credData)[0];
			const wrappedIndex = Object.keys(credData[certCategory]).indexOf("wrapped");
			if (wrappedIndex >= 0) {
				for (let key of Object.keys(credData[certCategory].wrapped)) {
					const hash = await MouroService.isInMouro(
						credData[certCategory].wrapped[key],
						data.payload.iss,
						Messages.ISSUER.ERR.NOT_FOUND
					);
					if (!hash) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.NOT_FOUND);

					// Validación de microcredencial
					const microCert = await Certificate.findByHash(hash);
					microCert.update(Constants.CERTIFICATE_STATUS.VERIFIED);
				}
			}
			// Se marca el certificado como validado
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
router.get("/user/:did", Validator.checkValidationResult, Validator.validateParams, async function (req, res) {
	try {
		const { did } = req.params;
		const user = await UserService.findByDid(did);
		const result = await userDTO(user);
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

/**
 *	Edita nombre y apellido,
 *  usado para migrar usuarios
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

/**
 *	Agrega una imagen de perfil al usuario
 */
router.post(
	"/user/:did/image",
	Validator.validateBody([]),
	Validator.checkValidationResult,
	Validator.validateParams,
	halfHourLimiter,
	async function (req, res) {
		try {
			const { path, mimetype, size } = req.file;
			const { did } = req.params;

			// MAX_MB * 1000000 da la cantidad exacta de los MB permitidos
			if (size > Constants.MAX_MB * 1000000) return ResponseHandler.sendErr(res, Messages.IMAGE.ERR.INVALID_SIZE);

			const { _id } = await UserService.saveImage(did, mimetype, path);
			const image_url = getImageUrl(_id);

			return ResponseHandler.sendRes(res, image_url);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * Devuelve la imagen de usuario según un id
 */
router.get(
	"/image/:id",
	Validator.validateBody([]),
	Validator.checkValidationResult,
	Validator.validateParams,
	async function (req, res) {
		try {
			const id = req.params.id;
			const { img, contentType } = await UserService.getImage(id);
			res.type(contentType);
			return res.send(img);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
