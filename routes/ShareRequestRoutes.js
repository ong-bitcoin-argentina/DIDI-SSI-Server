const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");
const Messages = require("../constants/Messages");
const Validator = require("./utils/Validator");
const { saveShareRequest, getShareRequestById } = require("../services/ShareRequestService");

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

router.get(
	"/shareRequest",
	Validator.validateBody(["id"]),
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
