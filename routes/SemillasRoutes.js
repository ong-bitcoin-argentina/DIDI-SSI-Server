const router = require('express').Router();
const ResponseHandler = require('../utils/ResponseHandler');
const SemillasService = require('../services/SemillasService');
const Messages = require('../constants/Messages');
const Constants = require('../constants/Constants');
const { checkValidationResult, validateBody } = require('../utils/Validator');

const { SUCCESS } = Messages.SEMILLAS;
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
router.get('/semillas/prestadores', checkValidationResult, async (req, res) => {
  try {
    const result = await SemillasService.getPrestadores();
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
});

/**
 * @openapi
 *   /semillas/notifyDniDid:
 *   post:
 *     summary: Solicita las credenciales de semillas.
 *     description: Notifica a semillas el did y el dni del usuario para
 *     que luego se le envíen las credenciales de semillas, identidad y beneficio
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
router.post(
  '/semillas/notifyDniDid',
  validateBody([
    { name: 'did', validate: [IS_STRING] },
    { name: 'dni', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  async (req, res) => {
    try {
      const { did, dni } = req.body;
      const didi = await SemillasService.sendDIDandDNI({ did, dni });
      return ResponseHandler.sendRes(res, didi);
    } catch (err) {
      return ResponseHandler.sendErr(res, err);
    }
  },
);

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
router.post(
  '/semillas/credentialShare',
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
  async (req, res) => {
    try {
      const data = req.body;
      await SemillasService.shareData(data);
      return ResponseHandler.sendRes(res, SUCCESS.SHARE_DATA);
    } catch (err) {
      return ResponseHandler.sendErrWithStatus(res, err);
    }
  },
);

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
  async (req, res) => {
    try {
      await SemillasService.validateDni(req.body);
      await SemillasService.generateValidation(req.body.did);
      return ResponseHandler.sendRes(res, SUCCESS.VALIDATE_DNI);
    } catch (err) {
      return ResponseHandler.sendErrWithStatus(res, err);
    }
  },
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
  async (req, res) => {
    const { did, state } = req.body;
    try {
      const result = await SemillasService.updateValidationState(did, state);
      return ResponseHandler.sendRes(res, result);
    } catch (err) {
      return ResponseHandler.sendErrWithStatus(res, err);
    }
  },
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
  async (req, res) => {
    const { did } = req.body;
    try {
      const result = await SemillasService.deleteValidationByDid(did);
      return ResponseHandler.sendRes(res, result);
    } catch (err) {
      return ResponseHandler.sendErrWithStatus(res, err);
    }
  },
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
router.get('/semillas/identityValidation/:did', checkValidationResult, async (req, res) => {
  const { did } = req.params;
  try {
    const result = await SemillasService.getValidation(did);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
});

module.exports = router;
