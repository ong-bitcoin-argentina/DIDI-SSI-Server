const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Certificate = require("../models/Certificate");
const MouroService = require("../services/MouroService");
const CertService = require("../services/CertService");
const UserService = require("../services/UserService");

const IssuerService = require("../services/IssuerService");

const BlockchainService = require("../services/BlockchainService");
const FirebaseService = require("../services/FirebaseService");

const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const { halfHourLimiter } = require("../policies/RateLimit");

const { CREATE, REFRESH, REVOKE } = Constants.DELEGATE_ACTIONS;

/**
 *	Valida el certificado generado por el issuer y lo envia a mouro para ser guardado
 */
router.post(
	"/issuer/issueCertificate",
	Validator.validateBody([
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "sendPush", validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN], optional: true }
	]),
	Validator.checkValidationResult,
	halfHourLimiter,
	async function (req, res) {
		const jwt = req.body.jwt;
		try {
			console.log("Issuing JWT...");

			// validar certificado y emisor (que este autorizado para emitir)
			console.log("Verifying JWT...");
			const cert = await CertService.verifyCertificate(jwt, undefined, Messages.ISSUER.ERR.IS_INVALID);
			if (!cert || !cert.payload) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			// Validar si el emistor es correcto (autorizado a emitir y el mismo que el del certificado)
			console.log(`Verifying issuer ${cert.payload.iss}`);
			const valid = cert && (await CertService.verifyIssuer(cert.payload.iss));
			if (!valid) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);

			// Validar sujeto (que este registrado en didi)
			console.log(`Verifying subject ${cert.payload.sub}`);
			const sub = cert.payload.sub;
			let subject = await UserService.getByDID(sub);
			if (!subject) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_SUB_IS_INVALID);

			console.log("Issued successfully!");

			// Guardar certificado en mouro
			console.log("Storing in mouro...");
			const result = await MouroService.saveCertificate(jwt, cert.payload.sub);

			// Guardar estado
			await Certificate.generate(
				Constants.CERTIFICATE_NAMES.GENERIC,
				cert.payload.sub,
				Constants.CERTIFICATE_STATUS.UNVERIFIED,
				result.data,
				result.hash
			);

			// Guardar hash de recuperacion (swarm)
			console.log("Asking for hash in mouro...");
			const hash = await MouroService.getHash(cert.payload.sub);
			if (hash) subject = await subject.updateHash(hash);

			// Enviar push notification
			if (req.body.sendPush) {
				console.log(`Sending push notification!`);
				try {
					const user = await UserService.getByDID(sub);
					await FirebaseService.sendPushNotification(
						Messages.PUSH.NEW_CERT.TITLE,
						Messages.PUSH.NEW_CERT.MESSAGE,
						user.firebaseId,
						Messages.PUSH.TYPES.NEW_CERT
					);
				} catch (err) {
					console.log("Error sending push notifications:");
					console.log(err);
				}
			}
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Permite al usuario dueño del did, pedir uno o más certificados para obtener la información de los mismos
 *	(genera un shareRequest y lo envia via mouro para que el usuario envíe la información)
 */
router.post(
	"/issuer/issueShareRequest",
	Validator.validateBody([
		{ name: "issuerDid", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	halfHourLimiter,
	async function (req, res) {
		const did = req.body.did;
		const jwt = req.body.jwt;
		try {
			// Comprobar que el emisor sea valido
			const decoded = await CertService.decodeCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
			await CertService.verifyIssuer(decoded.payload.iss);

			// Crear el pedido
			const shareReq = await CertService.createShareRequest(did, jwt);

			// Mandar el pedido a mouro para ser guardado
			const result = await MouroService.saveCertificate(shareReq, did);
			try {
				// Enviar push notification
				const user = await UserService.getByDID(did);
				await FirebaseService.sendPushNotification(
					Messages.PUSH.SHARE_REQ.TITLE,
					Messages.PUSH.SHARE_REQ.MESSAGE,
					user.firebaseId,
					Messages.PUSH.TYPES.SHARE_REQ
				);
			} catch (err) {
				console.log("Error sending push notifications:");
				console.log(err);
			}
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Permite revocar un certificado previamente almacenado en mouro
 */
router.post(
	"/issuer/revokeCertificate",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "sub", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "hash", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	halfHourLimiter,
	async function (req, res) {
		const did = req.body.did;
		const sub = req.body.sub;
		const jwt = req.body.jwt;
		const hash = req.body.hash;

		try {
			// Validar certificado y emisor
			console.log("Revoking JWT...");
			const cert = await CertService.verifyCertificate(jwt, hash, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!cert) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			// Validar si el emistor es correcto (autorizado a revocar)
			console.log(`Verifying issuer ${did}`);
			const valid = cert && (await CertService.verifyIssuer(did));
			if (!valid) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);

			// Validar que el sujeto este registrado en didi
			console.log(`Verifying subject ${sub}`);
			const subject = await UserService.getByDID(sub);
			if (!subject) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_SUB_IS_INVALID);

			// Revocar certificado
			console.log("Revoking in Mouro...");
			await MouroService.revokeCertificate(jwt, hash, sub);

			// Actualizar estado
			console.log("Updating cert status...");
			await Certificate.generate(
				Constants.CERTIFICATE_NAMES.GENERIC,
				cert.payload.sub,
				Constants.CERTIFICATE_STATUS.REVOKED,
				jwt,
				hash
			);

			console.log("Revoked successfully");
			return ResponseHandler.sendRes(res, Messages.ISSUER.CERT_REVOKED);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Permite validar un certificado a partir del jwt
 *	(utilizado principalmente por el viewer)
 */
router.post(
	"/issuer/verifyCertificate",
	Validator.validateBody([{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	halfHourLimiter,
	async function (req, res) {
		const jwt = req.body.jwt;
		try {
			// validar formato y desempaquetar
			console.log("Verifying JWT...");
			const decripted = await CertService.decodeCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
			const hash = await MouroService.isInMouro(jwt, decripted.payload.sub, Messages.ISSUER.ERR.NOT_FOUND);
			const cert = await CertService.verifyCertificate(jwt, hash, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!cert || !cert.payload.vc) {
				return ResponseHandler.sendRes(res, { cert: cert, err: Messages.ISSUER.ERR.CERT_IS_INVALID });
			}
			console.log("JWT verified!");

			console.log("Verifying Issuer...");
			const did = cert.payload.iss;
			await CertService.verifyIssuer(did);
			const issuer = await IssuerService.getIssuerByDID(did);
			if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);
			console.log("Issuer verified!");
			cert.issuer = issuer.name;
			return ResponseHandler.sendRes(res, cert);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Verifica la existencia del emisor según el did
 *  Obtiene y verifica que el código de validación sea correcto
 */
router.post(
	"/issuer/verify",
	Validator.validateBody([{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	halfHourLimiter,
	async function (req, res) {
		try {
			const did = req.body.did;
			await CertService.verifyIssuer(did);
			const issuer = await IssuerService.getIssuerByDID(did);
			if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);
			const { name, expireOn } = issuer;
			return ResponseHandler.sendRes(res, { did, name, expireOn });
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Autorizar un issuer para la emision de certificados
 *	(inseguro: cualquiera puede llamarlo, se recomienda eliminarlo en la version final)
 */
router.post(
	"/issuer",
	Validator.validateBody([
		{
			name: "did",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		},
		{
			name: "name",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const { did, name, callbackUrl, token } = req.body;
		try {
			const delegateTransaction = await IssuerService.createDelegateTransaction({
				did,
				name,
				callbackUrl,
				token,
				action: CREATE
			});

			return ResponseHandler.sendRes(res, delegateTransaction);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErrWithStatus(res, err, 403);
		}
	}
);

/**
 *	Revocar autorización de un emisor para emitir certificados
 *	(inseguro: cualquiera puede llamarlo, se recomienda eliminarlo en la version final)
 */
router.delete(
	"/issuer",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "token", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "callbackUrl", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const { did, callbackUrl, token } = req.body;
		try {
			const delegateTransaction = await IssuerService.createDelegateTransaction({
				did,
				callbackUrl,
				token,
				action: REVOKE
			});

			// elimino autorizacion en la blockchain
			await BlockchainService.revokeDelegate(did);
			return ResponseHandler.sendRes(res, Messages.ISSUER.DELETED);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Refrescar autorización de un emisor para emitir certificados
 */
router.post(
	"/issuer/:did/refresh",
	Validator.validateBody([
		{ name: "token", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "callbackUrl", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const { did } = req.params;
			const { token, callbackUrl } = req.body;

			const delegateTransaction = await IssuerService.createDelegateTransaction({
				did,
				callbackUrl,
				token,
				action: REFRESH
			});

			return ResponseHandler.sendRes(res, delegateTransaction);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErrWithStatus(res, err, 403);
		}
	}
);

/**
 *	Obtener nombre de un emisor autorizado a partir de su did
 */
router.get("/issuer/:did", async function (req, res) {
	const did = req.params.did;

	try {
		const issuer = await IssuerService.getIssuerByDID(did);
		if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);
		return ResponseHandler.sendRes(res, issuer.name);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

/**
 *	Editar el nombre de un emisor autorizado a partir de su did
 */
router.put(
	"/issuer/:did",
	Validator.validateBody([{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function (req, res) {
		try {
			const { did } = req.params;
			const { name } = req.body;

			const issuer = await IssuerService.editName(did, name);

			return ResponseHandler.sendRes(res, issuer.name);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
