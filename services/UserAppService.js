const UserApp = require('../models/UserApp');
const UserService = require('./UserService');
const AppAuthService = require('./AppAuthService');
const CertService = require('./CertService');
const { getPayload } = require('./TokenService');
const { userDTO } = require('../utils/DTOs');
const {
  VALIDATION: { DID_NOT_FOUND, APP_DID_NOT_FOUND },
  USER_APP: { NOT_FOUND },
  TOKEN: { INVALID_CODE },
} = require('../constants/Messages');

const {
  missingUserDID, missingAppDid, missingUserToken, missingAppToken,
} = require('../constants/serviceErrors');



/**
 *  Obtiene un usuario de una app autorizada por su did
 */
const findByUserDID = async function findByUserDID(userDid) {
  if (!userDid) throw missingUserDID;

  const user = await UserService.getByDID(userDid);
  if (!user) throw DID_NOT_FOUND(userDid);

  const userApp = await UserApp.getByDID(userDid);
  if (!userApp) throw NOT_FOUND(userDid);

  return userApp;
};

/**
 *  Crea y guarda el usuario de app autorizada en base de datos
 */
const createUser = async function createUser(userDid, appDid) {

  const user = await UserService.getByDID(userDid);
  if (!user) throw DID_NOT_FOUND(userDid);

  const appAuth = await AppAuthService.findByDID(appDid);
  if (!appAuth) throw APP_DID_NOT_FOUND(appDid);

  // eslint-disable-next-line no-underscore-dangle
  const userId = user._id;
  // eslint-disable-next-line no-underscore-dangle
  const appAuthId = appAuth._id;

  const userApp = await UserApp.getOrCreate(userId, appAuthId);

  return { appAuth, user, userApp };
};

/**
 *  Crea un usuario asociándolo con una app autorizada verificando los tokens
 */
const createByTokens = async function createByTokens(userToken, appToken) {
  if (!userToken) throw missingUserToken;
  if (!appToken) throw missingAppToken;

  const verified = await CertService.verifyCertificate(userToken);
  if (!verified.payload) throw INVALID_CODE(true);

  const userPayload = getPayload(userToken);
  const appPayload = getPayload(appToken);

  const userDid = userPayload.iss;
  const appDid = appPayload.iss;

  const { user, appAuth } = await createUser(userDid, appDid);
  const niceUser = await userDTO(user);
  return { ...niceUser, appName: appAuth.name };
};

module.exports = {
  createByTokens,
  findByUserDID,
};
