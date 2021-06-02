/* eslint-disable max-len */
const router = require('express').Router();
const user = require('../controllers/user');
const Constants = require('../constants/Constants');
const Validator = require('../utils/Validator');
const { validateAppOrUserJWT } = require('../middlewares/ValidateAppOrUserJWT');
const { halfHourLimiter } = require('../policies/RateLimit');

const {
  IS_STRING, IS_EMAIL, IS_PASSWORD, IS_MOBILE_PHONE,
} = Constants.VALIDATION_TYPES;

/**
 * @openapi
 *   /registerUser:
 *   post:
 *     summary: Genera usuario con su backup ('privateKeySeed') para recuperar la cuenta de didi.
 *     description: Tanto el mail como el teléfono tienen que haber sido validados previamente con "/verifySmsCode" y "/verifyMailCode".
 *     requestBody:
 *       required:
 *         - eMail
 *         - name
 *         - lastname
 *         - password
 *         - phoneNumber
 *         - did
 *         - privateKeySeed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eMail:
 *                 type: string
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               did:
 *                 type: string
 *               privateKeySeed:
 *                 type: string
 *               firebaseId:
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
  '/registerUser',
  Validator.validateBody([
    { name: 'eMail', validate: [IS_STRING, IS_EMAIL] },
    { name: 'name', validate: [IS_STRING] },
    { name: 'lastname', validate: [IS_STRING] },
    {
      name: 'password',
      validate: [IS_STRING, IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
    {
      name: 'phoneNumber',
      validate: [IS_STRING, IS_MOBILE_PHONE],
    },
    { name: 'did', validate: [IS_STRING] },
    { name: 'privateKeySeed', validate: [IS_STRING] },
    {
      name: 'firebaseId',
      validate: [IS_STRING],
      optional: true,
    },
  ]),
  Validator.checkValidationResult,
  user.createUser,
);

/**
 * @openapi
 *   /renewFirebaseToken:
 *   post:
 *     summary: Renueva el token de firebase.
 *     requestBody:
 *       required:
 *         - token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
router.post(
  '/renewFirebaseToken',
  Validator.validateBody([
    {
      name: 'token',
      validate: [Constants.VALIDATION_TYPES.IS_AUTH_TOKEN],
    },
  ]),
  Validator.checkValidationResult,
  user.updateFirebaseId,
);

/**
 * @openapi
 *   /recoverAccount:
 *   post:
 *     summary: Retorna la clave privada que sirve para recuperar la cuenta de didi.
 *     requestBody:
 *       required:
 *         - eMail
 *         - password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eMail:
 *                 type: string
 *               password:
 *                 type: string
 *               firebaseId:
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
  '/recoverAccount',
  Validator.validateBody([
    { name: 'eMail', validate: [IS_STRING, IS_EMAIL] },
    {
      name: 'password',
      validate: [IS_STRING, IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
    {
      name: 'firebaseId',
      validate: [IS_STRING],
      optional: true,
    },
  ]),
  user.readPrivateKey,
);

/**
 * @openapi
 *   /userLogin:
 *   post:
 *     summary: Valida que la contraseña se corresponda con la del usuario que tiene el did ingresado.
 *     description: No genera ningún token ni informaciún útil.
 *     requestBody:
 *       required:
 *         - did
 *         - password
 *         - eMail
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               password:
 *                 type: string
 *               eMail:
 *                 type: string
 *               firebaseId:
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
  '/userLogin',
  Validator.validateBody([
    { name: 'did', validate: [IS_STRING] },
    {
      name: 'password',
      validate: [IS_STRING, IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
    { name: 'eMail', validate: [IS_STRING, IS_EMAIL] },
    {
      name: 'firebaseId',
      validate: [IS_STRING],
      optional: true,
    },
  ]),
  Validator.checkValidationResult,
  halfHourLimiter,
  user.updateUserFirebaseId,
);

/**
 * @openapi
 *   /recoverPassword:
 *   post:
 *     summary: Permite cambiar la contraseña a partir de la cuenta de mail asociada al usuario.
 *     description: Require que se haya validado el mail ("/sendMailValidator") antes de usarse.
 *     requestBody:
 *       required:
 *         - eMail
 *         - eMailValidationCode
 *         - newPass
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eMail:
 *                 type: string
 *               eMailValidationCode:
 *                 type: string
 *               newPass:
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
  '/recoverPassword',
  Validator.validateBody([
    { name: 'eMail', validate: [IS_STRING, IS_EMAIL] },
    {
      name: 'eMailValidationCode',
      validate: [IS_STRING],
      length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH },
    },
    {
      name: 'newPass',
      validate: [IS_STRING, IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
  ]),
  Validator.checkValidationResult,
  user.recoverPassword,
);

/**
 * @openapi
 *   /changePassword:
 *   post:
 *     summary: Renueva la contraseña, dado el mail y contraseña anterior.
 *     requestBody:
 *       required:
 *         - did
 *         - oldPass
 *         - newPass
 *       content:
 *         application/json:ateService.js
Estabilidad
None
TaskMediana priority
Assignee: Silvia Verónica Oxalde
MM346-
 *               did:
 *                 type: string
 *               oldPass:
 *                 type: string
 *               newPass:
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
  '/changePassword',
  Validator.validateBody([
    { name: 'did', validate: [IS_STRING] },
    {
      name: 'oldPass',
      validate: [IS_STRING, IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
    {
      name: 'newPass',
      validate: [IS_STRING, IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
  ]),
  user.updatePassword,
);

/**
 * @openapi
 *   /changePhoneNumber:
 *   post:
 *     summary: Permite cambiar el número de teléfono asociado al usuario.
 *     description: Requiere que se haya validado el teléfono ("/sendSmsValidator") antes de usarse.
 *     requestBody:
 *       required:
 *         - did
 *         - newPhoneNumber
 *         - password
 *         - phoneValidationCode
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               newPhoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneValidationCode:
 *                 type: string
 *               firebaseId:
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
  '/changePhoneNumber',
  Validator.validateBody([
    { name: 'did', validate: [IS_STRING] },
    {
      name: 'newPhoneNumber',
      validate: [IS_STRING, IS_MOBILE_PHONE],
    },
    {
      name: 'password',
      validate: [IS_STRING, IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
    {
      name: 'phoneValidationCode',
      validate: [IS_STRING],
      length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH },
    },
    {
      name: 'firebaseId',
      validate: [IS_STRING],
      optional: true,
    },
  ]),
  Validator.checkValidationResult,
  halfHourLimiter,
  user.updatePhoneNumber,
);

/**
 * @openapi
 *   /changeEmail:
 *   post:
 *     summary: Permite cambiar el mail asociado al usuario.
 *     description: Require que se haya validado el mail ("/sendMailValidator") antes de usarse.
 *     requestBody:
 *       required:
 *         - did
 *         - newEMail
 *         - password
 *         - eMailValidationCode
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               did:
 *                 type: string
 *               newEMail:
 *                 type: string
 *               password:
 *                 type: string
 *               eMailValidationCode:
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
  '/changeEmail',
  Validator.validateBody([
    { name: 'did', validate: [IS_STRING] },

    { name: 'newEMail', validate: [IS_STRING, IS_EMAIL] },
    {
      name: 'password',
      validate: [IS_STRING, IS_PASSWORD],
      length: { min: Constants.PASSWORD_MIN_LENGTH },
    },
    {
      name: 'eMailValidationCode',
      validate: [IS_STRING],
      length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH },
    },
  ]),
  Validator.checkValidationResult,
  halfHourLimiter,
  user.updateEmail,
);

/**
 * @openapi
 *   /verifyCredentialRequest:
 *   post:
 *     summary: Permite pedir al usuario dueño del did, el certificado para validar que es efectivamente el dueño del mismo.
 *     description: Genera un shareRequest y lo envia via mouro para que el usuario valide el certificado.
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
  '/verifyCredentialRequest',
  Validator.validateBody([
    { name: 'did', validate: [IS_STRING] },
    { name: 'jwt', validate: [IS_STRING] },
  ]),
  Validator.checkValidationResult,
  user.createCredentialPetition,
);

/**
 * @openapi
 *   /verifyCredential:
 *   post:
 *     summary: Recibe la respuesta al pedido de "/verifyCredentialRequest", marcando al certificado como validado.
 *     requestBody:
 *       required:
 *         - access_token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
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
  '/verifyCredential',
  Validator.validateBody([{ name: 'access_token', validate: [IS_STRING] }]),
  Validator.checkValidationResult,
  user.updateCredentialPetition,
);

/**
 * @openapi
 *   /user/{did}:
 *   get:
 *     summary: Obtiene informacion sobre el usuario.
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
router.get('/user/:did',
  Validator.checkValidationResult,
  Validator.validateParams,
  user.readUserByDid);

/**
 * @openapi
 *   /user/{did}/edit:
 *   post:
 *     summary: Edita nombre y apellido.
 *     description: Usado para migrar usuarios.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required:
 *         - name
 *         - lastname
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastname:
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
  '/user/:did/edit',
  validateAppOrUserJWT,
  Validator.validateBody([
    { name: 'name', validate: [IS_STRING] },
    { name: 'lastname', validate: [IS_STRING] },
  ]),
  Validator.checkValidationResult,
  Validator.validateParams,
  user.updateUserByDid,
);

/**
 * @openapi
 *   /user/{did}/image:
 *   post:
 *     summary: Agrega una imagen de perfil al usuario.
 *     parameters:
 *       - name: did
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       content:
 *         image/png:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/user/:did/image',
  validateAppOrUserJWT,
  Validator.validateBody([]),
  Validator.checkValidationResult,
  Validator.validateParams,
  halfHourLimiter,
  user.createUserImageByDid,
);

/**
 * @openapi
 *   /image/{id}:
 *   get:
 *     summary: Devuelve la imagen de usuario según un id.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type : any
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/image/:id',
  Validator.validateBody([]),
  Validator.checkValidationResult,
  Validator.validateParams,
  user.readUserImageById,
);

module.exports = router;
