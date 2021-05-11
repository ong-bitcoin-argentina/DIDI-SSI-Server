/* eslint-disable max-len */

const router = require('express').Router();
const Constants = require('../constants/Constants');
const { checkValidationResult, validateBody } = require('../utils/Validator');
const semillas = require('../controllers/semillas');

const {
  IS_STRING, IS_EMAIL, IS_DNI, IS_MOBILE_PHONE, IS_NUMBER,
} = Constants.VALIDATION_TYPES;
const optional = true;

/**
 * @openapi
 *   /semillas/prestadores:
 *   get:
 *     summary: Obtiene los prestadores de semillas.
 *     description: Obtiene los prestadores de semillas.
 *     parameters:
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error interno del servidor
 */
router.get('/semillas/prestadores',
  checkValidationResult,
  semillas.readPrestadores);

/**
 * @openapi
 *   /semillas/notifyDniDid:
 *   post:
 *     summary: Solicita las credenciales de semillas.
 *     description: Notifica a semillas el did y el dni del usuario para que luego se le envíen las credenciales de semillas, identidad y beneficio
 *     requestBody:
 *       required:
 *         - did
 *         - dni
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               dni:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/semillas/notifyDniDid',
  validateBody([
    { name: 'did', validate: [IS_STRING] },
    { name: 'dni', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  semillas.readCredentials);

/**
 * @openapi
 *   /semillas/credentialShare:
 *   post:
 *     summary: Usuario comparte sus credenciales al prestador para solicitar su servicio
 *     description: Usuario comparte sus credenciales al prestador para solicitar su servicio.
 *     requestBody:
 *       required:
 *         - did
 *         - email
 *         - phone
 *         - viewerJWT
 *         - dni
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               viewerJWT:
 *                 type: string
 *               providerId:
 *                 type: number
 *               customProviderEmail:
 *                 type: string
 *               dni:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/semillas/credentialShare',
  validateBody([
    { name: 'did', validate: [IS_STRING] },
    { name: 'email', validate: [IS_STRING, IS_EMAIL] },
    { name: 'phone', validate: [IS_STRING, IS_MOBILE_PHONE] },
    { name: 'viewerJWT', validate: [IS_STRING] },
    { name: 'providerId', validate: [IS_NUMBER], optional },
    { name: 'customProviderEmail', validate: [IS_EMAIL], optional },
    { name: 'dni', validate: [IS_STRING, IS_DNI] },
  ]),
  checkValidationResult,
  semillas.shareCredentials);

/**
 * @openapi
 *   /semillas/validateDni:
 *   post:
 *     summary: Solicitud de validación de identidad a semillas.
 *     description: Solicitud de validación de identidad a semillas.
 *     requestBody:
 *       required:
 *         - did
 *         - dni
 *         - email
 *         - phone
 *         - name
 *         - lastName
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               dni:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/semillas/validateDni',
  validateBody([
    { name: 'did', validate: [IS_STRING] },
    { name: 'dni', validate: [IS_STRING, IS_DNI] },
    { name: 'email', validate: [IS_STRING, IS_EMAIL] },
    { name: 'phone', validate: [IS_STRING, IS_MOBILE_PHONE] },
    { name: 'name', validate: [IS_STRING] },
    { name: 'lastName', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  semillas.createDniValidation,
);

/**
 * @openapi
 *   /semillas/identityValidation:
 *   patch:
 *     summary: Actualización del estado de la solicitud de validación de identidad.
 *     description: Actualización del estado de la solicitud de validación de identidad.
 *     requestBody:
 *       required:
 *         - did
 *         - state
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  '/semillas/identityValidation',
  validateBody([
    { name: 'did', validate: [IS_STRING] },
    { name: 'state', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  semillas.updateDniValidation,
);

/**
 * @openapi
 *   /semillas/identityValidation:
 *   delete:
 *     summary: Elimina una solicitud de validación de identidad desde semillas.
 *     description: Elimina una solicitud de validación de identidad desde semillas.
 *     requestBody:
 *       required:
 *         - did
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  '/semillas/identityValidation',
  validateBody([{ name: 'did', validate: [IS_STRING] }]),
  checkValidationResult,
  semillas.removeDniValidationByDid,
);

/**
 * @openapi
 *   /semillas/identityValidation/{did}:
 *   get:
 *     summary: Obtiene el estado de validación de identidad desde semillas.
 *     description: Obtiene el estado de validación de identidad desde semillas.
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
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error interno del servidor
 */
router.get('/semillas/identityValidation/:did',
  checkValidationResult,
  semillas.readDniValidationByDid);

module.exports = router;
