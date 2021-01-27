const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");
const Messages = require("../constants/Messages");
const Validator = require("./utils/Validator");
const { getPresentation, savePresentation } = require("../services/PresentationService");

const BASE_URL = "/presentation";

// Asociada a ShareRequest (compartir credenciales)

// Guarda una presentación (que luego sera accedida a traves de un link en viewer)
router.post(
	BASE_URL,
	Validator.validateBody(["jwts"]),
	Validator.checkValidationResult,
	Validator.validateParams,
	async function (req, res) {
		try {
			const { _id } = await savePresentation(req.body);
			return ResponseHandler.sendRes(res, _id);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

// Obtiene una presentación por id
router.get(
	`${BASE_URL}/:id`,
	Validator.validateBody([]),
	Validator.checkValidationResult,
	Validator.validateParams,
	async function (req, res) {
		try {
			const { jwts } = await getPresentation(req.params);
			return ResponseHandler.sendRes(res, jwts);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
