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
  issuer.createShareRequest,
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
  issuer.verifyCertificateByJwt,
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
  issuer.verifyIssuerByDid,
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
 *         - description
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               callbackUrl:
 *                 type: string
 *               token:
 *                 type: string
 *               imageUrl:
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
    { name: 'did', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'description', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
    { name: 'imageUrl', validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
  ]),
  Validator.validateFile,
  Validator.checkValidationResult,
  issuer.createDelegation,
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
  issuer.deleteDelegation,
);

/**
 * @openapi
 *   /issuer/{did}/refresh:
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
  issuer.refreshDelegation,
);

/**
 * @openapi
 *   /issuer/list:
 *   get:
 *     summary: Obtiene una lista con la informacion de los emisores autorizados.
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
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/issuer/list', issuer.readAllIssuers);

/**
 * @openapi
 *   /issuer/{did}:
 *   get:
 *     summary: Obtiene la informacion de un emisor autorizado a partir de su did.
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
router.get('/issuer/:did', issuer.readIssuerByDid);

/**
 * @openapi
 *   /issuer/{did}/image:
 *   get:
 *     summary: Obtiene la imagen de un emisor autorizado a partir de su did.
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
router.get('/issuer/:did/image', issuer.readIssuerImagesByDid);

/**
 * @openapi
 *   /issuer/{did}:
 *   patch:
 *     summary: Modifica la informacion de un emisor autorizadod.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  '/issuer/:did',
  Validator.validateBody([
    { name: 'name', validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
    { name: 'description', validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
    { name: 'imageUrl', validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
  ]),
  Validator.validateFile,
  Validator.checkValidationResult,
  issuer.updateIssuerByDid,
);

/**
 * @openapi
 *   /issuer/{did}/shareRequest:
 *   post:
 *     summary: Crea un shareRequest asociandolo a un issuer
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - jwt
 *       content:
 *         multipart/form-data:
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
  '/issuer/:did/shareRequest',
  Validator.validateBody([
    { name: 'jwt', validate: [Constants.VALIDATION_TYPES.IS_STRING] },
  ]),
  Validator.validateFile,
  Validator.checkValidationResult,
  issuer.addShareRequest,
);

/**
 * @openapi
 *   /issuer/{did}/shareRequest/{id}:
 *   delete:
 *     summary: Dado un id elimina un shareRequest y lo remueve de la información del issuer
 *     parameters:
 *       - name: Authorization
 *         in: header
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
  '/issuer/:did/shareRequest',
  issuer.removeShareRequest,
);

module.exports = router;
