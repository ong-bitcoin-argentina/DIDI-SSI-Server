/* eslint-disable no-tabs */
/* eslint-disable no-console */
/* eslint-disable max-len */
const router = require('express').Router();
const { checkValidationResult, validateBody, validateParams } = require('../utils/Validator');
const Constants = require('../constants/Constants');
const CheckInsecure = require('../middlewares/Insecure');
const { ValidateAppJWT } = require('../middlewares/ValidateAppJWT');
const appUserAuth = require('../controllers/appUserAuth');

const { IS_STRING } = Constants.VALIDATION_TYPES;

router.use('/appAuth', CheckInsecure);
router.use('/userApp/validateUser', ValidateAppJWT);

/**
 * @openapi
 *   /appAuth/{did}:
 *   get:
 *     summary: Obtiene una aplicación autorizada según su did
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
router.get('/appAuth/:did',
  checkValidationResult,
  appUserAuth.readAppByDid);

/**
 * @openapi
 * 	 /appAuth:
 *   post:
 *     summary: Autoriza una aplicación para sincronizar con DIDI
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
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/appAuth',
  validateBody([
    { name: 'did', validate: [IS_STRING] },
    { name: 'name', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  appUserAuth.createAuthorizedApp,
);

/**
 * @openapi
 *   /userApp/{did}:
 *   get:
 *     summary: Obtiene un usuario según su did, cuya relación [user - app autorizada] fue establecida
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
router.get('/userApp/:did',
  validateParams,
  appUserAuth.readUserAppByDid);

/**
 * @openapi
 * 	 /userApp/validateUser:
 *   post:
 *     summary: Crea y valida la relacion user - app autorizada
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required:
 *         - userJWT
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userJWT:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401:
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/userApp/validateUser',
  validateBody([{ name: 'userJWT', validate: [IS_STRING] }]),
  checkValidationResult,
  appUserAuth.createUserFromAuthorizedApp);

module.exports = router;
