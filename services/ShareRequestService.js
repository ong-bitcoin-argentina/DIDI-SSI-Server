const Messages = require('../constants/Messages');
const ShareRequest = require('../models/ShareRequest');
const { getPayload } = require('./TokenService');

const {
  CREATE, NOT_FOUND, GET, USER_NOT_VALID,
} = Messages.SHAREREQUEST.ERR;

/**
 * Guarda un ShareRequest (Credencial a compartir por QR)
 */
module.exports.saveShareRequest = async function saveShareRequest({ jwt }) {
  try {
    const { aud, iss } = getPayload(jwt);
    return await ShareRequest.generate({ aud, iss, jwt });
  } catch (e) {
    throw CREATE;
  }
};

/**
 * Obtiene un ShareRequest según id (Devuelve un JWT con las credenciales previamente guardadas)
 */
module.exports.getShareRequestById = async function saveShareRequest({ id, userJWT }) {
  try {
    const shareRequest = await ShareRequest.getById(id);

    // Verifico si existe el share request
    if (!shareRequest) return Promise.reject(NOT_FOUND);

    // Verifico si el aud es el correcto con el token
    const { iss } = getPayload(userJWT);
    const { aud, jwt } = shareRequest;

    if (iss !== aud) return Promise.reject(USER_NOT_VALID);

    return jwt;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    throw GET;
  }
};
