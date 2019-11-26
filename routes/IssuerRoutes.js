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
			const isValid = await IssuerService.isValid(did);
			if (!isValid) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.IS_INVALID);

			const verified = await CertificateService.verifyCertificate(jwt, did, Messages.ISSUER.ERR.CERT_IS_INVALID);
			if(!verified) return ResponseHandler.sendErr(res, Messages.ISSUER.ERR.CERT_IS_INVALID);

			await CertificateService.saveCertificate(jwt);
			return ResponseHandler.sendRes(res, Messages.ISSUER.CERT_SAVED);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/issuer/",
	Validator.validateBody([{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;

		try {
			await IssuerService.create(did);
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
