/* eslint-disable no-tabs */
const router = require('express').Router();
const Validator = require('../utils/Validator');
const Constants = require('../constants/Constants');
const { validateAppOrUserJWT } = require('../middlewares/ValidateAppOrUserJWT');
const shareRequest = require('../controllers/shareRequest');

const { IS_STRING } = Constants.VALIDATION_TYPES;

const BASE_URL = '/shareRequest';

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
  Validator.validateBody([{ name: 'jwt', validate: [IS_STRING] }]),
  Validator.checkValidationResult,
  Validator.validateParams,
  shareRequest.createShareRequest,
);

/**
 * @openapi
 *   /shareRequest/{id}:
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
  shareRequest.readShareRequestById,
);

/**
 * @openapi
 *   /shareRequest/list:
 *   get:
 *     summary: Obtiene una lista con la informacion de los shareRequest
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de campos a mostrar por pagina
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numero de pagina a mostrar
 *       - in: query
 *         name: iss
 *         schema:
 *           type: string
 *         description: Did de quien emite el shareRequest
 *       - in: query
 *         name: aud
 *         schema:
 *           type: string
 *         description: Audiencia
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  `${BASE_URL}/list`,
  shareRequest.readAllShareRequests,
);

/**
 * @openapi
 *   /shareRequest/{id}:
 *   delete:
 *     summary: Elimina un ShareRequest según id
 *     parameters:
 *       - name: id
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
router.delete(
  `${BASE_URL}/:id`,
  Validator.validateParams,
  shareRequest.deleteShareRequestById,
);

module.exports = router;
