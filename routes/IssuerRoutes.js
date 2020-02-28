const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Certificate = require("../models/Certificate");
const MouroService = require("../services/MouroService");
const UserService = require("../services/UserService");

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
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const jwt = req.body.jwt;

		try {
			console.log("validating jwt for " + did);
			// validar certificado y emisor (que este autorizado para emitir)
			const verified = await MouroService.verifyCertificateAndDid(jwt, undefined, did, Messages.ISSUER.ERR.IS_INVALID);
			if (!verified) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			// validar sujeto (que este registrado en didi)
			const sub = verified.payload.sub;
			let subject = await UserService.getByDID(sub);
			if (!subject) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_SUB_IS_INVALID);

			console.log("creating certificate for " + did);
			// guardar certificado en mouro
			const result = await MouroService.saveCertificate(jwt, verified.payload.sub);

			// enviar push notification
			const user = await UserService.getByDID(sub);
			await FirebaseService.sendPushNotification(
				Messages.PUSH.NEW_CERT.TITLE,
				Messages.PUSH.NEW_CERT.MESSAGE,
				user.firebaseId,
				Messages.PUSH.TYPES.NEW_CERT
			);

			// guardar estado
			await Certificate.generate(
				Constants.CERTIFICATE_NAMES.GENERIC,
				verified.payload.sub,
				Constants.CERTIFICATE_STATUS.UNVERIFIED,
				result.data,
				result.hash
			);

			console.log("getting hash for " + did);
			// guardar hash de recuperacion (swarm)
			const hash = await MouroService.getHash(verified.payload.sub);
			if (hash) subject = await subject.updateHash(hash);

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
		{ name: "delegatorDid", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{ name: "issuerDid", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const delegatorDid = req.body.delegatorDid;
		const issuerDid = req.body.issuerDid;
		const did = req.body.did;
		const jwt = req.body.jwt;

		try {
			// validar que el emisor sea valido
			const decoded = await MouroService.decodeCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (decoded.payload.iss != issuerDid) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);
			await MouroService.verifyIssuerDid(issuerDid, decoded.payload.iss, delegatorDid);

			// crear el pedido y mandarlo a travez de mouro
			const shareReq = await MouroService.createShareRequest(did, jwt);
			const result = await MouroService.saveCertificate(shareReq, did);

			// enviar push notification
			const user = await UserService.getByDID(did);
			await FirebaseService.sendPushNotification(
				Messages.PUSH.SHARE_REQ.TITLE,
				Messages.PUSH.SHARE_REQ.MESSAGE,
				user.firebaseId,
				Messages.PUSH.TYPES.SHARE_REQ
			);

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
	async function(req, res) {
		const did = req.body.did;
		const sub = req.body.sub;
		const jwt = req.body.jwt;
		const hash = req.body.hash;

		try {
			// validar certificado y emisor
			const verified = await MouroService.verifyCertificateAndDid(jwt, hash, did, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!verified) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			console.log("revoking certificate for " + did);
			// revocar certificado
			await MouroService.revokeCertificate(jwt, hash, sub);

			// actualizar estado
			await Certificate.generate(
				Constants.CERTIFICATE_NAMES.GENERIC,
				verified.payload.sub,
				Constants.CERTIFICATE_STATUS.REVOKED,
				jwt,
				hash
			);

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
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "micros", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true }
	]),
	async function(req, res) {
		const jwt = req.body.jwt;
		const micros = req.body.micros ? req.body.micros.split(",") : [];

		let cert;
		try {
			// validar formato y desempaquetar
			const decripted = await MouroService.decodeCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
			const hash = await MouroService.isInMouro(jwt, decripted.payload.sub, Messages.ISSUER.ERR.NOT_FOUND);
			cert = await MouroService.verifyCertificate(jwt, hash, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!cert || !cert.payload.vc)
				return ResponseHandler.sendRes(res, { cert: cert, err: Messages.ISSUER.ERR.CERT_IS_INVALID });

			const subject = cert.payload.vc.credentialSubject;
			const keys = Object.keys(subject);
			const subcredentials = subject[keys[0]].wrapped;

			let err = cert.status === Constants.CERTIFICATE_STATUS.REVOKED ? Messages.ISSUER.ERR.REVOKED : false;

			// validar emisor
			let did = cert.payload.iss;
			try {
				const delegator = cert.payload.delegator;
				await MouroService.verifyIssuerDid(did, did, delegator);

				// obtener nombre del issuer para el certificado
				const issuerName = await BlockchainService.getDelegateName(delegator ? delegator : did);
				if (issuerName) {
					cert.issuer = issuerName;
				} else {
					cert.issuer = false;
					err = Messages.ISSUER.ERR.IS_INVALID;
				}
			} catch (_) {
				cert.issuer = false;
				err = Messages.ISSUER.ERR.IS_INVALID;
			}

			// tiene subcredenciales -> validarlas tambien
			if (subcredentials) {
				const data = {};
				const subcredencialKeys = Object.keys(subcredentials);

				const verifyCalls = [];
				const mouroCalls = [];
				for (let key of subcredencialKeys) {
					if (micros.length === 0 || micros.indexOf(key) >= 0) {
						const jwt = subcredentials[key];

						// validar formato y desempaquetar
						verifyCalls.push(MouroService.verifyCertificate(jwt, undefined, Messages.ISSUER.ERR.CERT_IS_INVALID));

						// validar fue emitido y no revocado
						mouroCalls.push(MouroService.isInMouro(jwt, decripted.payload.sub, Messages.ISSUER.ERR.NOT_FOUND));
					}
				}

				// verificar en // que las microcredenciales esten en mouro
				const mouroRes = await Promise.all(mouroCalls);
				if (!err) {
					for (let isInMouro of mouroRes) if (!isInMouro) err = Messages.ISSUER.ERR.NOT_FOUND;
				}

				// hacer verificaciones en //
				const childCerts = await Promise.all(verifyCalls);

				// para la primer subcredencial validar el issuer
				const firstSubCred = childCerts[0];

				if (cert.payload.iss !== firstSubCred.payload.iss && cert.payload.iss !== firstSubCred.payload.sub)
					err = Messages.ISSUER.ERR.IS_INVALID;

				// validar emisor para primer microcredencial
				const did = firstSubCred.payload.iss;
				const sub = firstSubCred.payload.sub;
				try {
					const delegator = firstSubCred.payload.delegator;
					await MouroService.verifyIssuerDid(did, did, delegator);
				} catch (_) {
					cert.issuer = false;
					err = Messages.ISSUER.ERR.IS_INVALID;
				}

				for (let childCert of childCerts) {
					if (!childCert) return ResponseHandler.sendRes(res, { cert: cert, err: Messages.ISSUER.ERR.CERT_IS_INVALID });

					// verificar que todas las microcredenciales tengan el mismo emisor (ya validado arriba) y destino
					if (did !== childCert.payload.iss || sub !== childCert.payload.sub) {
						cert.issuer = false;
						err = Messages.ISSUER.ERR.IS_INVALID;
					}

					// agregar la info
					const childSubject = childCert.payload.vc.credentialSubject;
					if (childSubject) {
						const childKeys = Object.keys(childSubject);
						if (childKeys.length && childSubject[childKeys[0]].data) {
							for (let childCertKey of Object.keys(childSubject[childKeys[0]].data))
								data[childCertKey] = childSubject[childKeys[0]].data[childCertKey];
						}
					}
				}
				subject[keys[0]].data = data;
			}

			if (err) return ResponseHandler.sendRes(res, { cert: cert, err: err });
			return ResponseHandler.sendRes(res, cert);
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
	"/issuer/",
	Validator.validateBody([{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;

		try {
			// autorizo en la blockchain
			await BlockchainService.addDelegate(
				Constants.SERVER_DID,
				{ from: Constants.SERVER_DID, key: Constants.SERVER_PRIVATE_KEY },
				did
			);
			return ResponseHandler.sendRes(res, Messages.ISSUER.CREATED);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Obtener nombre de un emisor autorizado a partir de su did
 */
router.get("/issuer/:did", async function(req, res) {
	const did = req.params.did;

	try {
		const issuerName = await BlockchainService.getDelegateName(did);
		if (!issuerName) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);
		return ResponseHandler.sendRes(res, issuerName);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

/**
 *	Revocar autorizacion de un emisor para emitir certificados
 *	(inseguro: cualquiera puede llamarlo, se recomienda eliminarlo en la version final)
 */
router.delete(
	"/issuer/",
	Validator.validateBody([{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;

		try {
			// elimino autorizacion en la blockchain
			await BlockchainService.revokeDelegate(
				Constants.SERVER_DID,
				{ from: Constants.SERVER_DID, key: Constants.SERVER_PRIVATE_KEY },
				did
			);

			return ResponseHandler.sendRes(res, Messages.ISSUER.DELETED);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Utilitario, permite generar header para hacer llamadas en la consola de mouro a mano
 *	(se recomienda eliminarlo en la version final)
 */
router.get("/headers/:did/:key", Validator.checkValidationResult, async function(req, res) {
	const did = req.params.did;
	const key = req.params.key;

	try {
		const header = await MouroService.getAuthHeader(did, key);
		return ResponseHandler.sendRes(res, { Authorization: header });
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

module.exports = router;
