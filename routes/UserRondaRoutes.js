const router = require("express").Router();
const { sendErrWithStatus, sendRes } = require("./utils/ResponseHandler");
const UserRondaService = require("../services/UserRondaService");
const Constants = require("../constants/Constants");
const { checkValidationResult, validateBody } = require("./utils/Validator");

const { IS_STRING } = Constants.VALIDATION_TYPES;

router.get("/userRonda/:did", checkValidationResult, async function (req, res) {
	const { did } = req.params;
	try {
		const result = await UserRondaService.findByUserDID(did);
		return sendRes(res, result);
	} catch (err) {
		return sendErrWithStatus(res, err);
	}
});

router.post(
	"/userRonda",
	validateBody([{ name: "did", validate: [IS_STRING] }]),
	checkValidationResult,
	async function (req, res) {
		const { did } = req.body;
		try {
			const user = await UserRondaService.createUser(did);
			return sendRes(res, user);
		} catch (err) {
			return sendErrWithStatus(res, err);
		}
	}
);

module.exports = router;
