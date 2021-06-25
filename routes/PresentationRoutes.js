/* eslint-disable no-tabs */
const router = require('express').Router();
const presentation = require('../controllers/presentation');
const Validator = require('../utils/Validator');

/**
 * Rutas asociadas a ShareRequest (compartir credenciales)
 */

/**
 * @openapi
 * 	 /presentation:
 *   post:
 *     summary: Guarda una presentación
 *     description: Se podra acceder a esta presentacion a través de un link en Validator Viewer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jwts:
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
  '/presentation',
  Validator.validateBody(['jwts']),
  Validator.checkValidationResult,
  Validator.validateParams,
  presentation.createPresentationByJwt,
);

/**
 * @openapi
 *   /presentation/{id}:
 *   get:
 *     summary: Obtiene una presentación dado un id
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
router.get(
  '/presentation/:id',
  Validator.validateBody([]),
  Validator.checkValidationResult,
  Validator.validateParams,
  presentation.readPresentationById,
);

module.exports = router;
