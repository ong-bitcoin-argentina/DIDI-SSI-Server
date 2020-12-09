const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");
const Messages = require("../constants/Messages");
const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");
const { saveShareRequest, getShareRequestById } = require("../services/ShareRequestService");
const { validateAppOrUserJWT } = require("../middlewares/ValidateAppOrUserJWT");

const { IS_STRING } = Constants.VALIDATION_TYPES;

const BASE_URL = "/shareRequest";

router.use("/shareRequest", validateAppOrUserJWT);

router.post(
	BASE_URL,
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

router.post(
	`${BASE_URL}/:id`,
	Validator.validateBody([]),
	Validator.checkValidationResult,
	Validator.validateParams,
	async function (req, res) {
		try {
			const { id } = req.params;
			const { userJWT } = req.body;
			const jwt = await getShareRequestById({ id, userJWT });
			res.type("text");
			return res.send(jwt);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
