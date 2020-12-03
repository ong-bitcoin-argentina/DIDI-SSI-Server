const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");
const Messages = require("../constants/Messages");
const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const { saveShareRequest, getShareRequestById } = require("../services/ShareRequestService");
const { validateAppOrUserJWT } = require("../middlewares/ValidateAppOrUserJWT");

const { IS_STRING } = Constants.VALIDATION_TYPES;

router.use("/shareRequest", validateAppOrUserJWT);

router.post(
	"/shareRequest",
	Validator.validateBody([{ name: "jwt", validate: [IS_STRING] }]),
	Validator.checkValidationResult,
	Validator.validateParams,
	async function (req, res) {
		try {
			const { _id } = await saveShareRequest(req.body);
			return ResponseHandler.sendRes(res, _id);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.get(
	"/shareRequest",
	Validator.validateBody([{ name: "id", validate: [IS_STRING] }]),
	Validator.checkValidationResult,
	Validator.validateParams,
	async function (req, res) {
		try {
			const jwt = await getShareRequestById(req.body);
			res.type("text");
			return res.send(jwt);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
