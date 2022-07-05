const router = require('express').Router();

const notification = require('../controllers/notification');

const { validateBody, checkValidationResult, validateParams } = require('../utils/Validator');
const { halfHourLimiter } = require('../policies/RateLimit');
const Constants = require('../constants/Constants');

const {
  IS_STRING,
} = Constants.VALIDATION_TYPES;

/**
 * @openapi
 *   /sendNotification:
 *   post:
 *     summary: Envia una notificación al usuario
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - title
 *         - message
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
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
  '/sendNotification',
  validateParams,
  validateBody([
    { name: 'title', validate: [IS_STRING] },
    { name: 'message', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  halfHourLimiter,
  notification.sendNotification,
);

module.exports = router;
