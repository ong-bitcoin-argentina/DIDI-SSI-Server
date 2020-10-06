const router = require("express").Router();
const { sendErrWithStatus, sendRes } = require("./utils/ResponseHandler");
const { checkValidationResult, validateBody, validateParams } = require("./utils/Validator");
const AppAuthService = require("../services/AppAuthService");
const UserAppService = require("../services/UserAppService");
const Constants = require("../constants/Constants");
const CheckInsecure = require("../middlewares/Insecure");
const { ValidateAppJWT } = require("../middlewares/ValidateAppJWT");

const { IS_STRING } = Constants.VALIDATION_TYPES;

router.use("/appAuth", CheckInsecure);
router.use("/userApp/validateUser", ValidateAppJWT);

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

router.get("/userApp/:did", validateParams, async function (req, res) {
	try {
		const { did } = req.params;
		const result = await UserAppService.findByUserDID(did);
		return sendRes(res, result);
	} catch (err) {
		console.log(err);
		return sendErrWithStatus(res, err);
	}
});

router.post(
	"/userApp/validateUser",
	validateBody([{ name: "userJWT", validate: [IS_STRING] }]),
	checkValidationResult,
	async function (req, res) {
		const { userJWT } = req.body;
		const appJWT = req.header("Authorization");
		try {
			const result = await UserAppService.createByTokens(userJWT, appJWT);
			return sendRes(res, result);
		} catch (err) {
			return sendErrWithStatus(res, err);
		}
	}
);

module.exports = router;
