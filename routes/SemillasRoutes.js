const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");
const SemillasService = require("../services/SemillasService");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const { checkValidationResult, validateBody } = require("./utils/Validator");

const { SUCCESS } = Messages.SEMILLAS;
const { IS_STRING, IS_EMAIL, IS_DNI, IS_MOBILE_PHONE, IS_NUMBER } = Constants.VALIDATION_TYPES;
const optional = true;

router.get("/semillas/prestadores", checkValidationResult, async function (req, res) {
	try {
		const result = await SemillasService.getPrestadores();
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		return ResponseHandler.sendErr(res, err);
	}
});

router.post(
	"/semillas/credentials",
	validateBody([
		{ name: "did", validate: [IS_STRING] },
		{ name: "dni", validate: [IS_STRING] }
	]),
	checkValidationResult,
	async function (req, res) {
		try {
			const { did, dni } = req.body;
			const didi = await SemillasService.sendDIDandDNI({ did, dni });
			return ResponseHandler.sendRes(res, didi);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/semillas/credentialShare",
	validateBody([
		{ name: "did", validate: [IS_STRING] },
		{ name: "email", validate: [IS_STRING, IS_EMAIL] },
		{ name: "phone", validate: [IS_STRING, IS_MOBILE_PHONE] },
		{ name: "viewerJWT", validate: [IS_STRING] },
		{ name: "providerId", validate: [IS_NUMBER], optional },
		{ name: "customProviderEmail", validate: [IS_EMAIL], optional },
		{ name: "dni", validate: [IS_STRING, IS_DNI] }
	]),
	checkValidationResult,
	async function (req, res) {
		try {
			const data = req.body;
			const response = await SemillasService.shareData(data);
			return ResponseHandler.sendRes(res, SUCCESS.SHARE_DATA);
		} catch (err) {
			return ResponseHandler.sendErrWithStatus(res, err);
		}
	}
);

router.post(
	"/semillas/validateDni",
	validateBody([
		{ name: "did", validate: [IS_STRING] },
		{ name: "dni", validate: [IS_STRING, IS_DNI] },
		{ name: "email", validate: [IS_STRING, IS_EMAIL] },
		{ name: "phone", validate: [IS_STRING, IS_MOBILE_PHONE] },
		{ name: "name", validate: [IS_STRING] },
		{ name: "lastName", validate: [IS_STRING] }
	]),
	checkValidationResult,
	async function (req, res) {
		try {
			const result = await SemillasService.validateDni(req.body);
			const validation = await SemillasService.generateValidation(req.body.did);
			return ResponseHandler.sendRes(res, SUCCESS.VALIDATE_DNI);
		} catch (err) {
			return ResponseHandler.sendErrWithStatus(res, err);
		}
	}
);

router.patch(
	"/semillas/identityValidation",
	validateBody([
		{ name: "did", validate: [IS_STRING] },
		{ name: "state", validate: [IS_STRING] }
	]),
	checkValidationResult,
	async function (req, res) {
		const { did, state } = req.body;
		try {
			const result = await SemillasService.updateValidationState(did, state);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErrWithStatus(res, err);
		}
	}
);

router.delete(
	"/semillas/identityValidation",
	validateBody([{ name: "did", validate: [IS_STRING] }]),
	checkValidationResult,
	async function (req, res) {
		const { did } = req.body;
		try {
			const result = await SemillasService.deleteValidationByDid(did);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErrWithStatus(res, err);
		}
	}
);

router.get("/semillas/identityValidation/:did", checkValidationResult, async function (req, res) {
	const { did } = req.params;
	try {
		const result = await SemillasService.getValidation(did);
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		return ResponseHandler.sendErrWithStatus(res, err);
	}
});

module.exports = router;
