const router = require("express").Router();
const Validator = require("../utils/Validator");
const Constants = require("../constants/Constants");
const renaper = require("../controllers/renaper");

/**
 * @openapi
 * 	 /renaper/validateDni:
 *   post:
 *     summary: Permite validar la identidad de un usuario contra renaper
 *     requestBody:
 *       required:
 *         - did
 *         - dni
 *         - gender
 *         - name
 *         - lastName
 *         - birthDate
 *         - order      
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               dni:
 *                 type: string
 *               gender:
 *                  enum:
 *                    - M
 *                    - F
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate: 
 *                 type: string
 *               order:
 *                 type: string
 *               selfieImage:
 *                 type: string
 *                 format: binary
 *               frontImage:
 *                 type: string
 *                 format: binary
 *               backImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 * 
 */
router.post(
	"/renaper/validateDni",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },

		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },

		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "lastName", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "birthDate", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "order", validate: [Constants.VALIDATION_TYPES.IS_STRING] },

		{ name: "selfieImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "frontImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "backImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] }
	]),
	Validator.checkValidationResult,
	renaper.validateDni
);

/**
 * @openapi
 * 	 /renaper/validateDniState:
 *   post:
 *     summary: Retorna el estado de un pedido realizado en "/validateDni"
 *     requestBody:
 *       required:
 *         - did
 *         - operationId
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               operationId:
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
	"/renaper/validateDniState",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "operationId", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	renaper.validateDniState
);

module.exports = router;
