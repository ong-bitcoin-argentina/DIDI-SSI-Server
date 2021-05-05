const AppAuth = require('../models/AppAuth');
const {
  VALIDATION: { APP_DID_NOT_FOUND },
} = require('../constants/Messages');
const {
  missingName, missingDid,
} = require('../constants/serviceErrors');

/**
 *  Obtiene una aplicación autorizada por su did
 */
const findByDID = async (did) => {
  if (!did) throw missingDid;
  const app = await AppAuth.getByDID(did);
  if (!app) throw APP_DID_NOT_FOUND(did);
  return app;
};

/**
 *  Crea una aplicación autorizada
 */
const createApp = async (did, name) => {
  if (!did) throw missingDid;
  if (!name) throw missingName;
  return AppAuth.create({ did, name });
};

module.exports = {
  findByDID,
  createApp,
};
