const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");
const Messages = require("../constants/Messages");
const Validator = require("./utils/Validator");
const { saveShareRequest } = require("../services/ShareRequestService");

router.post(
	"/shareRequest",
	Validator.validateBody(["jwt"]),
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

module.exports = router;
