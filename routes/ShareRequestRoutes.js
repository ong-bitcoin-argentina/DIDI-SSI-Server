const router = require("express").Router();
const ResponseHandler = require("../utils/ResponseHandler");
const Validator = require("../utils/Validator");
const Constants = require("../constants/Constants");
const { saveShareRequest, getShareRequestById } = require("../services/ShareRequestService");
const { validateAppOrUserJWT } = require("../middlewares/ValidateAppOrUserJWT");

const { IS_STRING } = Constants.VALIDATION_TYPES;

const BASE_URL = "/shareRequest";

router.use(BASE_URL, validateAppOrUserJWT);

/**
 * @openapi
 * 	 /shareRequest:
 *   post:
 *     summary: Guarda un ShareRequest
 *     description: Credencial a compartir por QR
 *     requestBody:
 *       required:
 *         - userJWT
 *         - jwt
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userJWT:
 *                 type: string
 *               jwt:
 *                 type: string
 *  
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @openapi
 *   /shareRequest/:{id}:
 *   post:
 *     summary: Obtiene un ShareRequest según id
 *     description: Devuelve un JWT con las credenciales previamente guardadas
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userJWT:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
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
