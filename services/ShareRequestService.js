const Messages = require('../constants/Messages');
const ShareRequest = require('../models/ShareRequest');
const { getPayload } = require('./TokenService');

const {
  CREATE, NOT_FOUND, GET, USER_NOT_VALID, DELETE,
} = Messages.SHAREREQUEST.ERR;

const {
  missingJwt, missingId, missingUserJWT, missingSolicitorDid,
} = require('../constants/serviceErrors');

/**
 * Guarda un ShareRequest (Credencial a compartir por QR)
 */
module.exports.saveShareRequest = async function saveShareRequest({ jwt }) {
  if (!jwt) throw missingJwt;
  try {
    const { aud, iss } = await getPayload(jwt);
    return ShareRequest.generate({ aud, iss, jwt });
  } catch (e) {
    throw CREATE;
  }
};

/**
 * Obtiene un ShareRequest según id (Devuelve un JWT con las credenciales previamente guardadas)
 */
module.exports.getShareRequestById = async function getShareRequestById({ id, userJWT }) {
  if (!id) throw missingId;
  if (!userJWT) throw missingUserJWT;
  try {
    const shareRequest = await ShareRequest.getById(id);

    // Verifico si existe el share request
    if (!shareRequest) return Promise.reject(NOT_FOUND);

    // Verifico si el aud es el correcto con el token
    const { iss } = await getPayload(await userJWT);
    const { aud, jwt } = shareRequest;

    if (iss !== aud) return Promise.reject(USER_NOT_VALID);

    return jwt;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    throw GET;
  }
};

/**
 * Eliminar un ShareRequest segun su id
 */
module.exports.deleteShareRequest = async function deleteShareRequest(id) {
  if (!id) throw missingId;
  try {
    const shareRequest = await ShareRequest.getById(id);
    if (!shareRequest) return Promise.reject(NOT_FOUND);
    return shareRequest.delete();
  } catch (e) {
    throw DELETE;
  }
};

/**
 *  Devuelve informacion de todos los ShareRequest
 */
module.exports.getAll = async function getAll(limit, page, aud, iss, solicitorDid) {
  if (!solicitorDid) throw missingSolicitorDid;
  return ShareRequest.getAll(limit, page, aud, iss, solicitorDid);
};
