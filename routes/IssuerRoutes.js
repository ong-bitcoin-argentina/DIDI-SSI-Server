const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const IssuerService = require("../services/IssuerService");
const CertificateService = require("../services/CertificateService");

const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

router.post(
	"/issuer/issueCertificate",
	Validator.validateBody([{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.validateBody([{ name: "jwt", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const jwt = req.body.jwt;

		try {
			const issuer = await IssuerService.getIssuer(did);
			if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);

			const verified = await CertificateService.verifyCertificateAndDid(jwt, did, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!verified) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			const result = await CertificateService.saveCertificate(jwt, verified.payload.sub);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/issuer/revokeCertificate",
	Validator.validateBody([{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.validateBody([{ name: "sub", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.validateBody([{ name: "hash", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const sub = req.body.sub;
		const hash = req.body.hash;

		try {
			const issuer = await IssuerService.getIssuer(did);
			if (!issuer) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);

			await CertificateService.revokeCertificate(hash, sub);
			return ResponseHandler.sendRes(res, Messages.ISSUER.CERT_SAVED);
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
			cert = await CertificateService.verifyCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if (!cert) return ResponseHandler.sendRes(res, { cert: cert, err: Messages.ISSUER.ERR.CERT_IS_INVALID });

			const subject = cert.payload.vc.credentialSubject;
			const keys = Object.keys(subject);
			const subcredentials = subject[keys[0]].wrapped;

			// tiene subcredenciales
			if (subcredentials) {
				let err = false;

				const data = {};
				const subcredencialKeys = Object.keys(subcredentials);

				const verifyCalls = [];
				const mouroCalls = [];
				for (let key of subcredencialKeys) {
					const jwt = subcredentials[key];
					// validar formato y desempaquetar
					verifyCalls.push(CertificateService.verifyCertificate(jwt, Messages.ISSUER.ERR.CERT_IS_INVALID));

					// validar fue emitido y no revocado
					mouroCalls.push(CertificateService.isInMouro(jwt, Messages.ISSUER.ERR.NOT_FOUND));
				}

				const mouroRes = await Promise.all(mouroCalls);
				for (let isInMouro of mouroRes) if (!isInMouro) err = Messages.ISSUER.ERR.NOT_FOUND;

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
				if (!cert.issuer) return ResponseHandler.sendRes(res, { cert: cert, err: Messages.ISSUER.ERR.IS_INVALID });

				// validar fue emitido y no revocado
				const isInMouro = await CertificateService.isInMouro(jwt, Messages.ISSUER.ERR.NOT_FOUND);
				if (!isInMouro) return ResponseHandler.sendRes(res, { cert: cert, err: Messages.ISSUER.ERR.NOT_FOUND });

				return ResponseHandler.sendRes(res, cert);
			}
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendRes(res, err);
		}
	}
);

router.post(
	"/issuer/",
	Validator.validateBody([{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.validateBody([{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
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

module.exports = router;
