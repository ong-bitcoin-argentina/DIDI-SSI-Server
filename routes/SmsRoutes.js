/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const router = require('express').Router();
const ResponseHandler = require('../utils/ResponseHandler');
const Certificate = require('../models/Certificate');

const SmsService = require('../services/SmsService');
const UserService = require('../services/UserService');
const MouroService = require('../services/MouroService');
const CertService = require('../services/CertService');

const { validateBody, checkValidationResult } = require('../utils/Validator');
const CodeGenerator = require('../utils/CodeGenerator');
const Messages = require('../constants/Messages');
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
 *     description: El usuario debe proveer su número de celular para poder generar una validación a través de SMS. Si el did ya tiene un usuario asociado, se requiere el ingreso de la contraseña para dicho usuario.
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
  async (req, res) => {
    const phoneNumber = await UserService.normalizePhone(req.body.cellPhoneNumber);
    const { did } = req.body;
    const { password } = req.body;
    const { unique } = req.body;

    try {
      // Validar que el teléfono no esté en uso
      if (unique) await UserService.telTaken(phoneNumber, did);

      // Si se ingresó contraseña, validarla
      if (password && did) await UserService.getAndValidate(did, password);

      // Generar código de validación
      const code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
      // eslint-disable-next-line no-console
      if (Constants.DEBUGG) console.log(code);

      // Crear y guardar pedido de validación de teléfono
      await SmsService.create(phoneNumber, code, undefined);

      // Mandar sms con el código de validacion
      if (Constants.NO_SMS) {
        return ResponseHandler.sendRes(res, { code });
      }

      await SmsService.sendValidationCode(phoneNumber, code);

      return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.SENT);
    } catch (err) {
      return ResponseHandler.sendErr(res, err);
    }
  },
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
  async (req, res) => {
    const cellPhoneNumber = await UserService.normalizePhone(req.body.cellPhoneNumber);

    const { validationCode } = req.body;
    const { did } = req.body;

    try {
      // Validar código
      const phone = await SmsService.isValid(cellPhoneNumber, validationCode);

      // Validar que no existe un usuario con ese mail
      const user = await UserService.getByTel(cellPhoneNumber);
      if (user) return ResponseHandler.sendErr(res, Messages.SMS.ERR.ALREADY_EXISTS);

      // Generar certificado validando que ese did le corresponde al dueño del teléfono
      const cert = await CertService.createPhoneCertificate(did, cellPhoneNumber);
      await CertService.verifyCertificatePhoneNumber(cert);

      // Revocar certificado anterior
      const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.TEL);
      for (const elem of old) {
        elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
        const jwt = await elem.getJwt();
        await MouroService.revokeCertificate(jwt, elem.hash, did);
      }

      // Mandar certificado a mouro
      const jwt = await MouroService.saveCertificate(cert, did);

      // Validar código y actualizar pedido de validación de teléfono
      await Certificate.generate(
        Constants.CERTIFICATE_NAMES.TEL,
        did,
        Constants.CERTIFICATE_STATUS.UNVERIFIED,
        jwt.data,
        jwt.hash,
      );
      await SmsService.validatePhone(phone, did);
      return ResponseHandler.sendRes(res, Messages.SMS.SUCCESS.MATCHED(cert));
    } catch (err) {
      return ResponseHandler.sendErr(res, err);
    }
  },
);

module.exports = router;
