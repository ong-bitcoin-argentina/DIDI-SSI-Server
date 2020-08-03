const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const SemillasService = require("../services/SemillasService");

const { checkValidationResult, validateBody } = require("./utils/Validator");
const Messages = require("../constants/Messages");
const { SUCCESS } = Messages.SEMILLAS;
const Constants = require("../constants/Constants");
const { IS_STRING, IS_EMAIL } = Constants.VALIDATION_TYPES;

router.get("/semillas/prestadores", checkValidationResult, async function (req, res) {
	try {
		const prestadores = await SemillasService.getPrestadores();
		return ResponseHandler.sendRes(res, prestadores);
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
	"/semillas/shareData",
	validateBody([
		{ name: "email", validate: [IS_STRING, IS_EMAIL] },
		{ name: "phoneNumber", validate: [IS_STRING] },
		{ name: "CERTIFICADO O CURSO", validate: [IS_STRING] },
		{ name: "Dni Beneficiario", validate: [IS_STRING] },
		{ name: "Nombre Beneficiario", validate: [IS_STRING] },
		{ name: "Fecha de Nacimiento", validate: [IS_STRING] }
	]),
	checkValidationResult,
	async function (req, res) {
		try {
			const data = req.body;
			const response = await SemillasService.shareEmail(data);
			return ResponseHandler.sendRes(res, SUCCESS.SHARE_DATA);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
