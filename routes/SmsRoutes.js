/* eslint-disable max-len */
const router = require('express').Router();

const sms = require('../controllers/sms');
const { validateBody, checkValidationResult } = require('../utils/Validator');
const Constants = require('../constants/Constants');
const { halfHourLimiter } = require('../policies/RateLimit');

const {
  IS_STRING, IS_MOBILE_PHONE, IS_PASSWORD, IS_BOOLEAN,
} = Constants.VALIDATION_TYPES;

/**
 * @openapi
 *   /sendSmsValidator:
 *   post:
 *     summary: Validación de teléfono
 *     description: El usuario debe proveer su número de celular para poder generar una validación a través de SMS. Si el did ya tiene un usuario asociado, se requiere el ingreso de la contraseña para dicho usuario. El numero debe ser ingresado con + adelante y sin 0 luego del codigo de pais.
 *     requestBody:
 *       required:
 *         - cellPhoneNumber
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cellPhoneNumber:
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
  '/sendSmsValidator',
  validateBody([
    {
      name: 'cellPhoneNumber',
      validate: [IS_STRING, IS_MOBILE_PHONE],
    },
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
  sms.createSmsValidation,
);

/**
 * @openapi
 *   /verifySmsCode:
 *   post:
 *     summary: Validación del código de 6 digitos enviado por SMS
 *     description: El usuario debe ingresar el código de validacion, el cuál debe haberse mandado previamente con "/sendSmsValidator".
 *     requestBody:
 *       required:
 *         - cellPhoneNumber
 *         - validationCode
 *         - did
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cellPhoneNumber:
 *                 type: string
 *               validationCode:
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
  '/verifySmsCode',
  validateBody([
    {
      name: 'cellPhoneNumber',
      validate: [IS_STRING, IS_MOBILE_PHONE],
    },
    {
      name: 'validationCode',
      validate: [IS_STRING],
      length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH },
    },
    { name: 'did', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  halfHourLimiter,
  sms.createCertificateBySmsValidation,
);

module.exports = router;
