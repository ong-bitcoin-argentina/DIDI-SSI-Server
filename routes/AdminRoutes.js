const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const UserService = require("../services/UserService");
const AuthRequestService = require("../services/AuthRequestService");
const SemillasService = require("../services/SemillasService");

const { userDTO } = require("../utils/DTOs");
const { validateAdminJWT } = require("../middlewares/ValidateAdminJWT");

const Validator = require("./utils/Validator");

router.use("/admin/", validateAdminJWT);

/**
 * @openapi
 *   /admin/user/did/:{did}:
 *   get:
 *     summary: Obtiene información confidencial sobre el usuario según su did.
 *     description: Incluye status de renaper y de semillas.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */

router.get(
	"/admin/user/did/:did",
	Validator.checkValidationResult,
	Validator.validateParams,
	async function (req, res) {
		try {
			const { did } = req.params;
			const user = await UserService.findByDid(did);
			if (!user) return ResponseHandler.sendErrWithStatus(res, { message: "User does not exist" }, 404);

			const renaper = await AuthRequestService.getByDID(did);

			let semillas;
			try {
				semillas = await SemillasService.getValidation(did);
			} catch (e) {
				semillas = null;
			}

			const result = await userDTO(user, { renaper, semillas });
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErrWithStatus(res, err, 500);
		}
	}
);

/**
 * @openapi
 *   /admin/user/phone:
 *   post:
 *     summary: Obtiene informacion confidencial sobre el usuario según su numero de teléfono.
 *     requestBody:
 *       required:
 *         - phone
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */

router.post("/admin/user/phone", Validator.checkValidationResult, Validator.validateParams, async function (req, res) {
	try {
		const { phone } = req.body;
		const user = await UserService.getByTel(phone);
		if (!user) return ResponseHandler.sendErrWithStatus(res, { message: "User does not exist" }, 404);
		const result = await userDTO(user);
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		return ResponseHandler.sendErrWithStatus(res, err, 500);
	}
});

module.exports = router;
