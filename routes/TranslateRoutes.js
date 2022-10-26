/* eslint-disable no-tabs */
const router = require('express').Router();
const translate = require('../controllers/translate');
const Validator = require('../utils/Validator');

/**
 * Rutas asociadas a Translate (servicio de traducciones clave-valor)
 */

/**
 * @openapi
 *   /translate:
 *   get:
 *     summary: Obtiene los recursos de traducción
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/translate',
  Validator.validateBody([]),
  Validator.checkValidationResult,
  translate.readAll,
);

module.exports = router;
