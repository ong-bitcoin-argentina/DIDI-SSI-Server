/* eslint-disable no-tabs */
const router = require('express').Router();
const ResponseHandler = require('../utils/ResponseHandler');
const Validator = require('../utils/Validator');
const { getPresentation, savePresentation } = require('../services/PresentationService');

const BASE_URL = '/presentation';

/**
 * Asociada a ShareRequest (compartir credenciales)
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
  BASE_URL,
  Validator.validateBody(['jwts']),
  Validator.checkValidationResult,
  Validator.validateParams,
  async (req, res) => {
    try {
      const { _id } = await savePresentation(req.body);
      return ResponseHandler.sendRes(res, _id);
    } catch (err) {
      return ResponseHandler.sendErr(res, err);
    }
  },
);

/**
 * @openapi
 *   /presentation/:{id}:
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
  `${BASE_URL}/:id`,
  Validator.validateBody([]),
  Validator.checkValidationResult,
  Validator.validateParams,
  async (req, res) => {
    try {
      const { jwts } = await getPresentation(req.params);
      return ResponseHandler.sendRes(res, jwts);
    } catch (err) {
      return ResponseHandler.sendErr(res, err);
    }
  },
);

module.exports = router;
