/* eslint-disable max-len */
const router = require('express').Router();

const shareResponse = require('../controllers/shareResponse');
const Constants = require('../constants/Constants');
const Validator = require('../utils/Validator');

/**
 * @openapi
 *   /shareResponse/{did}:
 *   post:
 *     summary: Guarda un ShareResponse
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - jwt
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jwt:
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
  '/shareResponse/:did',
  Validator.validateBody([{ name: 'jwt', validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
  Validator.checkValidationResult,
  Validator.validateParams,
  shareResponse.addShareResponse,
);

module.exports = router;
