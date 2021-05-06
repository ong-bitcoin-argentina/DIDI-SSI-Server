const router = require('express').Router();
const Constants = require('../constants/Constants');
const { checkValidationResult, validateBody } = require('../utils/Validator');
const semillas = require('../controllers/semillas');

const {
  IS_STRING, IS_EMAIL, IS_DNI, IS_MOBILE_PHONE, IS_NUMBER,
} = Constants.VALIDATION_TYPES;
const optional = true;

/**
 * Obtiene los prestadores de semillas
 */
router.get('/semillas/prestadores',
  checkValidationResult,
  semillas.readProviders);

/**
 * Notifica a semillas el did y el dni del usuario
 * Para que luego se le envíen las credenciales de semillas, identidad y beneficio
 * En resumen: Solicita las credenciales de semillas
 */
router.post('/semillas/notifyDniDid',
  validateBody([
    { name: 'did', validate: [IS_STRING] },
    { name: 'dni', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  semillas.readCredentialsByDidAndDni);

/**
 * Usuario comparte sus credenciales al prestador para solicitar su servicio
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
 * Solicitud de validación de identidad a semillas
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
  semillas.createValidationDni,
);

/**
 * Actualización del estado de la solicitud de validación de identidad
 */
router.patch(
  '/semillas/identityValidation',
  validateBody([
    { name: 'did', validate: [IS_STRING] },
    { name: 'state', validate: [IS_STRING] },
  ]),
  checkValidationResult,
  semillas.updateValidation,
);

/**
 * Elimina una solicitud de validación de identidad desde semillas
 */
router.delete(
  '/semillas/identityValidation',
  validateBody([{ name: 'did', validate: [IS_STRING] }]),
  checkValidationResult,
  semillas.removeValidationByDid,
);

/**
 * Obtiene el estado de validación de identidad desde semillas
 */
router.get('/semillas/identityValidation/:did',
  checkValidationResult,
  semillas.readValidationStateByDid);

module.exports = router;
