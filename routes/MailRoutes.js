/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable no-tabs */
const router = require('express').Router();
const mail = require('../controllers/mail');
const { validateBody, checkValidationResult } = require('../utils/Validator');
const Constants = require('../constants/Constants');
const { halfHourLimiter } = require('../policies/RateLimit');

const {
  IS_STRING, IS_EMAIL, IS_PASSWORD, IS_BOOLEAN,
} = Constants.VALIDATION_TYPES;

/**
 * @openapi
 * 	 /sendMailValidator:
 *   post:
 *     summary: Validación del email
 *     description: El usuario debe proveer su dirección de email personal para poder
 *	     generar una validación a través del envío de un correo electrónico.
 *	     Si el did ya tiene un usuario asociado, se requiere el ingreso de la contraseña para dicho usuario.
 *     requestBody:
 *       required:
 *         - eMail
 *         - password
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               eMail:
 *                 type: string
 *               did:
 *                 type: string
 *               password:
 *                 type: string
 *               unique:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/sendMailValidator',
  validateBody([
    { name: 'eMail', validate: [IS_STRING, IS_EMAIL] },
    { name: 'did', validate: [IS_STRING], optional: true },
    {
      name: 'password',
      validate: [IS_STRING, IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
      optional: true,
    },
    { name: 'unique', validate: [IS_BOOLEAN], optional: true },
  ]),
  checkValidationResult,
  halfHourLimiter,
  mail.createMailVerification,
);

/**
 * @openapi
 * 	 /reSendMailValidator:
 *   post:
 *     summary: Reenviar validación del email
 *     requestBody:
 *       required:
 *         - eMail
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               eMail:
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
  '/reSendMailValidator',
  validateBody([{ name: 'eMail', validate: [IS_STRING, IS_EMAIL] }]),
  checkValidationResult,
  mail.retryMailVerification,
);

/**
 * @openapi
 * 	 /verifyMailCode:
 *   post:
 *     summary: Validación del código de 6 digitos enviado por Mail
 *     description: El usuario debe ingresar el código de validacion previamente mandado con "/sendMailValidator".
 *     requestBody:
 *       required:
 *         - validationCode
 *         - eMail
 *         - did
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               validationCode:
 *                 type: string
 *               eMail:
 *                 type: string
 *               did:
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
  '/verifyMailCode',
  validateBody([
    {
      name: 'validationCode',
      validate: [IS_STRING],
      length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH },
    },
    { name: 'eMail', validate: [IS_STRING, IS_EMAIL] },
    { name: 'did', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  halfHourLimiter,
  mail.createCertificateByMailCode,
);

module.exports = router;
