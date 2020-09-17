const router = require("express").Router();
const { sendErrWithStatus, sendRes } = require("./utils/ResponseHandler");
const AppAuthService = require("../services/AppAuthService");
const Constants = require("../constants/Constants");
const { checkValidationResult, validateBody } = require("./utils/Validator");
const CheckInsecure = require("../middlewares/Insecure");

const { IS_STRING } = Constants.VALIDATION_TYPES;

router.use("/appAuth", CheckInsecure);

router.get("/appAuth/:did", checkValidationResult, async function (req, res) {
	const { did } = req.params;
	try {
		const result = await AppAuthService.findByDID(did);
		return sendRes(res, result);
	} catch (err) {
		return sendErrWithStatus(res, err);
	}
});

router.post(
	"/appAuth",
	validateBody([
		{ name: "did", validate: [IS_STRING] },
		{ name: "name", validate: [IS_STRING] }
	]),
	checkValidationResult,
	async function (req, res) {
		try {
			const { did, name } = req.body;
			const didi = await AppAuthService.createApp(did, name);
			return sendRes(res, didi);
		} catch (err) {
			return sendErrWithStatus(res, err);
		}
	}
);

module.exports = router;
