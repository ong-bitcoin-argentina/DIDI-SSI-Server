const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Certificate = require("../models/Certificate");
const IssuerService = require("../services/IssuerService");
const MouroService = require("../services/MouroService");
const UserService = require("../services/UserService");

const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

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
			console.log("checking issuer authorization for " + did);
			const issuer = await IssuerService.getIssuer(did);
			if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);

			console.log("validating jwt for " + did);
			const verified = await MouroService.verifyCertificateAndDid(jwt, did, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!verified) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			const sub = verified.payload.sub;
			let subject = await UserService.getByDID(sub);
			if (!subject) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_SUB_IS_INVALID);

			console.log("creating certificate for " + did);
			const result = await MouroService.saveCertificate(jwt, verified.payload.sub);

			await Certificate.generate(
				Constants.CERTIFICATE_NAMES.GENERIC,
				verified.payload.sub,
				Constants.CERTIFICATE_STATUS.UNVERIFIED,
				result.data,
				result.hash
			);

			console.log("getting hash for " + did);
			const hash = await MouroService.getHash(verified.payload.sub);
			if (hash) subject = await subject.updateHash(hash);

			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/issuer/issueShareRequest",
	Validator.validateBody([
		{ name: "issuerDid", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const issuerDid = req.body.issuerDid;
		const did = req.body.did;
		const jwt = req.body.jwt;

		try {
			// validar que el emisor sea valido
			const decoded = await MouroService.decodeCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (decoded.payload.iss != issuerDid) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			const issuer = await IssuerService.getIssuer(issuerDid);
			if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);

			const shareReq = await MouroService.createShareRequest(did, jwt);
			const result = await MouroService.saveCertificate(shareReq, did);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

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
			console.log("checking issuer authorization for " + did);
			const issuer = await IssuerService.getIssuer(did);
			if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);

			const verified = await MouroService.verifyCertificateAndDid(jwt, did, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!verified) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			console.log("revoking certificate for " + did);
			await MouroService.revokeCertificate(jwt, hash, sub);

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

router.post(
	"/issuer/verifyCertificate",
	Validator.validateBody([{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	async function(req, res) {
		const jwt = req.body.jwt;

		let cert;
		try {
			// validar formato y desempaquetar
			cert = await MouroService.verifyCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!cert || !cert.payload.vc)
				return ResponseHandler.sendRes(res, { cert: cert, err: Messages.ISSUER.ERR.CERT_IS_INVALID });

			const subject = cert.payload.vc.credentialSubject;
			const keys = Object.keys(subject);
			const subcredentials = subject[keys[0]].wrapped;

			console.log(cert.status);
			let err = cert.status === Constants.CERTIFICATE_STATUS.REVOKED ? Messages.ISSUER.ERR.REVOKED : false;

			// tiene subcredenciales
			if (subcredentials) {
				const data = {};
				const subcredencialKeys = Object.keys(subcredentials);

				const verifyCalls = [];
				const mouroCalls = [];
				for (let key of subcredencialKeys) {
					const jwt = subcredentials[key];
					// validar formato y desempaquetar
					verifyCalls.push(MouroService.verifyCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID));

					// validar fue emitido y no revocado
					mouroCalls.push(MouroService.isInMouro(jwt, Messages.ISSUER.ERR.NOT_FOUND));
				}

				const mouroRes = await Promise.all(mouroCalls);
				if (!err) {
					for (let isInMouro of mouroRes) if (!isInMouro) err = Messages.ISSUER.ERR.NOT_FOUND;
				}

				const childCerts = await Promise.all(verifyCalls);

				// para la primer subcredencial validar el issuer
				const firstSubCred = childCerts[0];

				if (cert.payload.iss !== firstSubCred.payload.iss && cert.payload.iss !== firstSubCred.payload.sub)
					err = Messages.ISSUER.ERR.IS_INVALID;

				const did = firstSubCred.payload.iss;
				const sub = firstSubCred.payload.sub;
				const issuer = await IssuerService.getIssuer(did);
				if (!issuer) {
					cert.issuer = false;
					err = Messages.ISSUER.ERR.IS_INVALID;
				}

				for (let childCert of childCerts) {
					if (!childCert) return ResponseHandler.sendRes(res, { cert: cert, err: Messages.ISSUER.ERR.CERT_IS_INVALID });

					// verificar que el issuer sea el mismo que en la primer subcredencial (el validado mas arriba)
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
				if (issuer) cert.issuer = issuer.name;
				if (err) return ResponseHandler.sendRes(res, { cert: cert, err: err });
				return ResponseHandler.sendRes(res, cert);
			} else {
				//no tiene subcredenciales

				// validar emisor
				const issuer = await IssuerService.getIssuer(cert.payload.iss);
				cert.issuer = issuer ? issuer.name : false;
				if (!err && !cert.issuer) err = Messages.ISSUER.ERR.IS_INVALID;

				// validar fue emitido y no revocado
				if (!err) {
					const isInMouro = await MouroService.isInMouro(jwt, Messages.ISSUER.ERR.NOT_FOUND);
					if (!isInMouro) err = Messages.ISSUER.ERR.NOT_FOUND;
				}

				if (err) return ResponseHandler.sendRes(res, { cert: cert, err: err });
				return ResponseHandler.sendRes(res, cert);
			}
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/issuer/",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const name = req.body.name;

		try {
			await IssuerService.create(did, name);
			return ResponseHandler.sendRes(res, Messages.ISSUER.CREATED);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.get("/issuer/:did", Validator.checkValidationResult, async function(req, res) {
	const did = req.params.did;

	try {
		const issuer = await IssuerService.getIssuer(did);
		if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);
		return ResponseHandler.sendRes(res, issuer.name);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

router.delete(
	"/issuer/",
	Validator.validateBody([{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;

		try {
			await IssuerService.delete(did);
			return ResponseHandler.sendRes(res, Messages.ISSUER.DELETED);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

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
