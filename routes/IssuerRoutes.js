/* eslint-disable max-len */
const router = require('express').Router();

const issuer = require('../controllers/issuer');
const Constants = require('../constants/Constants');
const Validator = require('../utils/Validator');
const { halfHourLimiter } = require('../policies/RateLimit');

/**
 * @openapi
 *   /issuer/issueCertificate:
 *   post:
 *     summary: Valida el certificado generado por el issuer y lo envia a mouro para ser guardado.
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
 *               sendPush:
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
  '/issuer/issueCertificate',
  Validator.validateBody([
    { name: 'jwt', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'sendPush', validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN], optional: true },
  ]),
  Validator.checkValidationResult,
  halfHourLimiter,
  issuer.createCertificateByJwt,
);

/**
 * @openapi
 *   /issuer/issueShareRequest:
 *   post:
 *     summary: Permite al usuario dueño del did, pedir uno o más certificados para obtener la información de los mismos.
 *     description: Genera un shareRequest y lo envia via mouro para que el usuario envíe la información
 *     requestBody:
 *       required:
 *         - did
 *         - jwt
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
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
  '/issuer/issueShareRequest',
  Validator.validateBody([
    { name: 'did', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'jwt', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
  ]),
  Validator.checkValidationResult,
  halfHourLimiter,
  issuer.readCertificateByDid,
);

/**
 * @openapi
 *   /issuer/revokeCertificate:
 *   post:
 *     summary: Permite revocar un certificado previamente almacenado en mouro.
 *     requestBody:
 *       required:
 *         - did
 *         - sub
 *         - jwt
 *         - hash
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               sub:
 *                 type: string
 *               jwt:
 *                 type: string
 *               hash:
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
  '/issuer/revokeCertificate',
  Validator.validateBody([
    { name: 'did', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'sub', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'jwt', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'hash', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
  ]),
  Validator.checkValidationResult,
  halfHourLimiter,
  issuer.deleteCertificate,
);

/**
 * @openapi
 *   /issuer/verifyCertificate:
 *   post:
 *     summary: Permite validar un certificado a partir del jwt.
 *     description: Utilizado principalmente por el viewer.
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
  '/issuer/verifyCertificate',
  Validator.validateBody([{ name: 'jwt', validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
  halfHourLimiter,
  issuer.createCertificateByJwt,
);

/**
 * @openapi
 *   /issuer/verify:
 *   post:
 *     summary: Verifica la existencia del emisor según el did.
 *     description: Obtiene y verifica que el código de validación sea correcto.
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
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/issuer/verify',
  Validator.validateBody([{ name: 'did', validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
  halfHourLimiter,
  issuer.validateIssuerByDid,
);

/**
 * @openapi
 *   /issuer:
 *   post:
 *     summary: Autorizar un issuer para la emision de certificados.
 *     requestBody:
 *       required:
 *         - did
 *         - name
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               name:
 *                 type: string
 *               callbackUrl:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       403:
 *         description: Acción denegada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/issuer',
  Validator.validateBody([
    {
      name: 'did',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
    {
      name: 'name',
      validate: [Constants.VALIDATION_TYPES.IS_STRING],
    },
  ]),
  Validator.checkValidationResult,
  issuer.createDelegateCertificate,
);

/**
 * @openapi
 *   /issuer:
 *   delete:
 *     summary: Revocar autorización de un emisor para emitir certificados.
 *     requestBody:
 *       required:
 *         - did
 *         - token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               callbackUrl:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  '/issuer',
  Validator.validateBody([
    { name: 'did', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'token', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
  ]),
  Validator.checkValidationResult,
  issuer.deleteDelegateCertificate,
);

/**
 * @openapi
 *   /issuer/:{did}/refresh:
 *   post:
 *     summary: Refresca la autorización de un emisor para emitir certificados.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - token
 *         - callbackUrl
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               callbackUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       403:
 *         description: Acción denegada
 *       500:
 *         description: Error interno del servidor
 */

router.post(
  '/issuer/:did/refresh',
  Validator.validateBody([
    { name: 'token', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'callbackUrl', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
  ]),
  Validator.checkValidationResult,
  issuer.refreshDelegateCertificate,
);

/**
 * @openapi
 *   /issuer/:{did}:
 *   get:
 *     summary: Obtiene el nombre de un emisor autorizado a partir de su did.
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
 *       500:
 *         description: Error interno del servidor
 */
router.get('/issuer/:did', issuer.readIssuerNameByDid);

/**
 * @openapi
 *   /issuer/:{did}:
 *   put:
 *     summary: Edita el nombre de un emisor autorizado a partir de su did.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - name
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  '/issuer/:did',
  Validator.validateBody([{ name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] }]),
  Validator.checkValidationResult,
  issuer.editIssuerNameByDid,
);

module.exports = router;
