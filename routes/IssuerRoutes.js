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

/**
 *	Valida y envia a mouro el certificado generado por el issuer para ser guardado
 */
router.post(
	"/issuer/issueCertificate",
	Validator.validateBody([
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "sendPush", validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN], optional: true }
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const jwt = req.body.jwt;
		try {
			console.log("Issuing JWT...");

			// validar certificado y emisor (que este autorizado para emitir)
			console.log("Verifying JWT...");
			const cert = await CertService.verifyCertificate(jwt, undefined, Messages.ISSUER.ERR.IS_INVALID);
			if (!cert || !cert.payload) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			console.log(`Verifying issuer ${cert.payload.iss}`);
			// Validar si el emistor es correcto (autorizado a emitir y el mismo que el del certificado)
			const valid = cert && await CertService.verifyIssuer(cert.payload.iss);
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

			// guardar hash de recuperacion (swarm)
			console.log("Asking for hash in mouro...");
			const hash = await MouroService.getHash(cert.payload.sub);
			if (hash) subject = await subject.updateHash(hash);

			// enviar push notification
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
 *	Permite pedir al usuario dueño del did, uno o mas certificados para obtener la informacion de los mismos
 *	(genera un shareRequest y lo envia via mouro para que el usuario envie la informacion)
 */
router.post(
	"/issuer/issueShareRequest",
	Validator.validateBody([
		{ name: "issuerDid", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const did = req.body.did;
		const jwt = req.body.jwt;
		try {
			// validar que el emisor sea valido
			const decoded = await CertService.decodeCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
			await CertService.verifyIssuer(decoded.payload.iss);

			// crear el pedido y mandarlo a travez de mouro
			const shareReq = await CertService.createShareRequest(did, jwt);
			const result = await MouroService.saveCertificate(shareReq, did);
			try {
				// enviar push notification
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
 *	(la revocacion no esta implementada en mouro)
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
	async function (req, res) {
		const did = req.body.did;
		const sub = req.body.sub;
		const jwt = req.body.jwt;
		const hash = req.body.hash;

		try {
			console.log("Revoking JWT...");
			// validar certificado y emisor
			const cert = await CertService.verifyCertificate(jwt, hash, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!cert) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			console.log(`Verifying issuer ${did}`);
			// Validar si el emistor es correcto (autorizado a revocar)
			const valid = cert && await CertService.verifyIssuer(did);
			if (!valid) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.ISSUER_IS_INVALID);

			console.log(`Verifying subject ${sub}`);
			// Validar sujeto (que este registrado en didi)
			const subject = await UserService.getByDID(sub);
			if (!subject) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_SUB_IS_INVALID);

			// revocar certificado
			console.log("Revoking in Mouro...");
			await MouroService.revokeCertificate(jwt, hash, sub);

			// actualizar estado
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
	Validator.validateBody([
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
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
 *	Permite validar un certificado a partir del jwt
 *	(utilizado principalmente por el viewer)
 */
router.post(
	"/issuer/verify",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
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
		try {
			const issuer = await IssuerService.addIssuer(req.body.did, req.body.name);
			return ResponseHandler.sendRes(res, issuer);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErrWithStatus(res, err, 403);
		}
	}
);

/**
 *	Revocar autorizacion de un emisor para emitir certificados
 *	(inseguro: cualquiera puede llamarlo, se recomienda eliminarlo en la version final)
 */
router.delete(
	"/issuer",
	Validator.validateBody([{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function (req, res) {
		const did = req.body.did;
		if (!process.env.ENABLE_INSECURE_ENDPOINTS) {
			return ResponseHandler.sendErrWithStatus(res, new Error("Disabled endpoint"), 404);
		}
		try {
			// elimino autorizacion en la blockchain
			await BlockchainService.revokeDelegate(did);
			return ResponseHandler.sendRes(res, Messages.ISSUER.DELETED);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
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

module.exports = router;
