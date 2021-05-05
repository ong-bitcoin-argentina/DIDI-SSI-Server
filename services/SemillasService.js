const fetch = require('node-fetch');
const { SEMILLAS_URLS, SEMILLAS_LOGIN } = require('../constants/Constants');
const { postOptions, postOptionsAuth, getOptionsAuth } = require('../constants/RequestOptions');
const SemillasAuth = require('../models/SemillasAuth');
const SemillasValidation = require('../models/SemillasValidation');
const {
  VALIDATION: { DID_NOT_FOUND },
} = require('../constants/Messages');

/**
 *  Fetch a semillas
 */
const semillasFetch = async function semillasFetch(url, data) {
  let token = await SemillasAuth.getToken();
  const options = data ? postOptionsAuth : getOptionsAuth;
  let res = await fetch(url, options(token, data));

  // Vuelve a intentar porque semillas elimina el token si el usuario esta logueado desde otro sitio
  if (res.status === 401) {
    token = await SemillasAuth.createOrUpdateToken();
    res = await fetch(url, options(token, data));
  }
  return res;
};

const handleJsonResponse = async (res) => {
  const content = await res.json();
  if (!res.ok) {
    throw new Error({
      message: content.userMessage,
    });
  }
  return content;
};

const handleTextResponse = async (res) => {
  const content = await res.text();
  if (!res.ok) {
    throw new Error(content);
  }
  return content;
};

/**
 *  Obtiene los prestadores de semillas
 */
module.exports.getPrestadores = async function getPrestadores() {
  const res = await semillasFetch(SEMILLAS_URLS.PRESTADORES);
  // TODO: hack, because semillas does not support filtering by active field
  return (await res.json()).filter((p) => p.active);
};

/**
 *  LogIn en Semillas
 */
module.exports.login = async function login() {
  const res = await fetch(SEMILLAS_URLS.LOGIN, postOptions(SEMILLAS_LOGIN));
  return res.json();
};

/**
 *  Dados dni y did, solicita las credenciales a semillas
 */
module.exports.sendDIDandDNI = async function sendDIDandDNI({ dni, did }) {
  const data = { dni, did };
  const res = await semillasFetch(SEMILLAS_URLS.CREDENTIALS_DIDI, data);
  return res.json();
};

/**
 *  Usuario comparte sus credenciales al prestador para solicitar su servicio
 */
module.exports.shareData = async function shareData(data) {
  const res = await semillasFetch(SEMILLAS_URLS.SHARE_DATA, data);
  return handleJsonResponse(res);
};

/**
 *  Validación de dni
 */
module.exports.validateDni = async function validateDni(data) {
  const res = await semillasFetch(SEMILLAS_URLS.VALIDATE_DNI, data);
  return handleTextResponse(res);
};

/**
 *  Genera nueva validación
 */
module.exports.generateValidation = async function generateValidation(did) {
  return SemillasValidation.generate(did);
};

/**
 *  Actualización del estado de la solicitud de validación de identidad
 */
module.exports.updateValidationState = async function updateValidationState(did, state) {
  const validation = await SemillasValidation.updateByUserDID(did, state);
  if (!validation) throw DID_NOT_FOUND(did);
  return validation;
};

/**
 *  Elimina una solicitud de validación de identidad desde semillas
 */
module.exports.deleteValidationByDid = async function deleteValidationByDid(did) {
  const validation = await SemillasValidation.deleteByUserDID(did);
  if (!validation) throw DID_NOT_FOUND(did);
  return validation;
};

/**
 *  Obtiene el estado de validación de identidad desde semillas
 */
module.exports.getValidation = async function getValidation(did) {
  const validation = await SemillasValidation.getByUserDID(did);
  if (!validation) throw DID_NOT_FOUND(did);
  const { createdOn, modifiedOn, state } = validation;
  return { createdOn, modifiedOn, state };
};
