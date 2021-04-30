const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Certificate = require("../models/Certificate");
const MouroService = require("../services/MouroService");
const CertService = require("../services/CertService");
const UserService = require("../services/UserService");

const IssuerService = require("../services/IssuerService");

const FirebaseService = require("../services/FirebaseService");

const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const { halfHourLimiter } = require("../policies/RateLimit");

const { CREATE, REFRESH, REVOKE } = Constants.DELEGATE_ACTIONS;

/**
 * @openapi
 *   /issuer/issueCertificate:
 *   post:
 *     summary: Valida el certificado generado por el issuer y lo envia a mouro para ser guardado.
 *     requestBody:
 *       required:
 *         - jwt
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jwt:
 *                 type: string
 *               sendPush:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /issuer/issueShareRequest:
 *   post:
 *     summary: Permite al usuario dueño del did, pedir uno o más certificados para obtener la información de los mismos.
 *     description: Genera un shareRequest y lo envia via mouro para que el usuario envíe la información
 *     requestBody:
 *       required:
 *         - did
 *         - jwt
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               jwt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */

router.post(
	"/issuer/issueShareRequest",
	Validator.validateBody([
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
 * @openapi
 *   /issuer/revokeCertificate:
 *   post:
 *     summary: Permite revocar un certificado previamente almacenado en mouro.
 *     requestBody:
 *       required:
 *         - did
 *         - sub
 *         - jwt
 *         - hash
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               sub:
 *                 type: string
 *               jwt:
 *                 type: string
 *               hash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /issuer/verifyCertificate:
 *   post:
 *     summary: Permite validar un certificado a partir del jwt.
 *     description: Utilizado principalmente por el viewer.
 *     requestBody:
 *       required:
 *         - jwt
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jwt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /issuer/verify:
 *   post:
 *     summary: Verifica la existencia del emisor según el did.
 *     description: Obtiene y verifica que el código de validación sea correcto.
 *     requestBody:
 *       required:
 *         - did
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /issuer:
 *   post:
 *     summary: Autorizar un issuer para la emision de certificados.
 *     requestBody:
 *       required:
 *         - did
 *         - name
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               name:
 *                 type: string
 *               callbackUrl:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       403: 
 *         description: Acción denegada
 *       500:
 *         description: Error interno del servidor
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
			const didExist = await IssuerService.getIssuerByDID(did);
			if (didExist) throw Messages.ISSUER.ERR.DID_EXISTS;
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
 * @openapi
 *   /issuer:
 *   delete:
 *     summary: Revocar autorización de un emisor para emitir certificados.
 *     requestBody:
 *       required:
 *         - did
 *         - token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               callbackUrl:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */

router.delete(
	"/issuer",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "token", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
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
			return ResponseHandler.sendRes(res, delegateTransaction);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 *   /issuer/:{did}/refresh:
 *   post:
 *     summary: Refresca la autorización de un emisor para emitir certificados.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - token
 *         - callbackUrl
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               callbackUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       403: 
 *         description: Acción denegada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /issuer/:{did}:
 *   get:
 *     summary: Obtiene el nombre de un emisor autorizado a partir de su did.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
 * @openapi
 *   /issuer/:{did}:
 *   put:
 *     summary: Edita el nombre de un emisor autorizado a partir de su did.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - name
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
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
