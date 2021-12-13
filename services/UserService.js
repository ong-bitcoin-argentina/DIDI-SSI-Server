const User = require('../models/User');
const Messages = require('../constants/Messages');
const PhoneNormalization = require('./utils/PhoneNormalization');
const Image = require('../models/Image');
const { getPayload } = require('./TokenService');

const {
  missingDid,
  missingData,
  missingEmail,
  missingPhoneNumber,
  missingPassword,
  missingPrivateKeySeed,
  missingFirebaseId,
  missingName,
  missingLastName,
  missingContentType,
  missingPath,
  missingId,
  missingJwt,
} = require('../constants/serviceErrors');
const { createImage } = require('./utils/imageHandler');

const { DID_NOT_FOUND } = Messages.VALIDATION;

/**
 * Obtener usuario a partir de un did
 */
const getByDID = async function getByDID(did) {
  if (!did) throw missingDid;
  try {
    const user = await User.getByDID(did);
    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};
module.exports.getByDID = getByDID;

/**
 * Creado porque getByDID no retorna error en caso de no existir
 * (puede que algun endpoint este esperando ese resultado)
 */
const findByDid = async (did) => {
  if (!did) throw missingDid;
  const user = await User.getByDID(did);
  if (!user) throw DID_NOT_FOUND(did);
  return user;
};
module.exports.findByDid = findByDid;

/**
 * Obtener usuario a partir de un did y actualizar su información
 */
const findByDidAndUpdate = async (did, data) => {
  if (!did) throw missingDid;
  if (!data) throw missingData;
  const user = await User.findByDidAndUpdate(did, data);
  if (!user) throw DID_NOT_FOUND(did);
  return user;
};
module.exports.findByDidAndUpdate = findByDidAndUpdate;

/**
 * Obtener usuario a partir de un mail
 */
const getByEmail = async function getByEmail(email) {
  if (!email) throw missingEmail;
  try {
    const user = await User.getByEmail(email);
    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};
module.exports.getByEmail = getByEmail;

/*
 * Obtener usuario a partir un número de teléfono
 */
const getByTel = async function getByTel(phoneNumber) {
  if (!phoneNumber) throw missingPhoneNumber;
  try {
    const user = await User.getByTel(phoneNumber);
    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};
module.exports.getByTel = getByTel;

/**
 * Obtener usuario y validar contraseña
 */
const getAndValidate = async function getAndValidate(did, pass, email) {
  if (!did) throw missingDid;
  if (!pass) throw missingPassword;
  try {
    // Obtener usuario
    let user = await getByDID(did);
    if (!user) {
      if (email) user = await getByEmail(email);
      if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_DID);
    }

    // Validar contraseña
    const match = await user.compareField('password', pass);
    if (!match) return Promise.reject(Messages.USER.ERR.INVALID_USER);
    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.USER.ERR.INVALID_USER);
  }
};
module.exports.getAndValidate = getAndValidate;

/**
 * Dado un email, verifica si este esta en uso
 */
const emailTaken = async function emailTaken(mail, exceptionDid) {
  if (!mail) throw missingEmail;
  try {
    const taken = await User.emailTaken(mail, exceptionDid);
    if (taken) return Promise.reject(Messages.USER.ERR.EMAIL_TAKEN);
    return Promise.resolve();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.USER.ERR.VALIDATE);
  }
};
module.exports.emailTaken = emailTaken;

/**
 * Verifica si un númer de teléfono ya esta en uso
 */
const telTaken = async function telTaken(tel, exceptionDid) {
  if (!tel) throw missingPhoneNumber;
  try {
    const taken = await User.telTaken(tel, exceptionDid);
    if (taken) return Promise.reject(Messages.USER.ERR.TEL_TAKEN);
    return Promise.resolve(taken);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw Messages.USER.VALIDATE;
  }
};
module.exports.telTaken = telTaken;

/**
 * Crear un usuario, siempre que este no exista uno asociado al did
 */
module.exports.create = async function create(
  did,
  privateKeySeed,
  userMail,
  phoneNumber,
  userPass,
  firebaseId,
  name,
  lastname,
) {
  if (!did) throw missingDid;
  if (!privateKeySeed) throw missingPrivateKeySeed;
  if (!userMail) throw missingEmail;
  if (!phoneNumber) throw missingPhoneNumber;
  if (!userPass) throw missingPassword;
  if (!firebaseId) throw missingFirebaseId;
  if (!name) throw missingName;
  if (!lastname) throw missingLastName;
  try {
    // Verificar si ya existe un usuario asociado a ese did
    let user = await getByDID(did);
    if (user) return Promise.reject(Messages.USER.ERR.USER_ALREADY_EXIST);

    // Crear usuario
    user = await User.generate(
      did, privateKeySeed, userMail, phoneNumber, userPass, firebaseId, name, lastname,
    );
    if (!user) return Promise.reject(Messages.USER.ERR.CREATE);
    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 *  Validar contraseña
 */
module.exports.login = async function login(did, email, pass) {
  if (!did) throw missingDid;
  if (!email) throw missingEmail;
  if (!pass) throw missingPassword;
  let user;
  try {
    user = await getAndValidate(did, pass, email);

    const sameEmail = await user.compareField('mail', email);
    if (sameEmail === false) return Promise.reject(Messages.USER.ERR.INVALID_LOGIN);
    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.USER.ERR.INVALID_LOGIN);
  }
};

/**
 *  Retorna la clave privada de didi
 */
module.exports.recoverAccount = async function recoverAccount(mail, pass, firebaseId) {
  if (!mail) throw missingEmail;
  if (!pass) throw missingPassword;
  if (!firebaseId) throw missingFirebaseId;
  let user;
  try {
    // Buscar usuario asociado al mail
    user = await User.getByEmail(mail);

    if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_EMAIL);

    // Validar contraseña
    const isMatch = await user.compareField('password', pass);
    if (!isMatch) return Promise.reject(Messages.USER.ERR.INVALID_USER);

    await user.updateFirebaseId(firebaseId);

    // Retornar clave privada
    return Promise.resolve(user.getSeed());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 *  Obtener usuario y actualizar su mail
 */
module.exports.changeEmail = async function changeEmail(did, newMail, password) {
  if (!did) throw missingDid;
  if (!newMail) throw missingEmail;
  if (!password) throw missingPassword;
  try {
    // Obtener usuario
    let user = await getByDID(did);
    if (!user) return Promise.reject(Messages.USER.ERR.GET);

    // Validar contraseña
    const isMatch = await user.compareField('password', password);
    if (!isMatch) return Promise.reject(Messages.USER.ERR.INVALID_USER);

    // Actualizar mail
    user = await user.updateEmail(newMail);

    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.USER.ERR.UPDATE);
  }
};

/**
 *  Obtener usuario y actualizar su número de teléfono
 */
module.exports.changePhoneNumber = async function changePhoneNumber(
  did, newPhoneNumber, password, firebaseId,
) {
  if (!did) throw missingDid;
  if (!newPhoneNumber) throw missingPhoneNumber;
  if (!password) throw missingPassword;
  try {
    // Obtener usuario
    let user = await getByDID(did);
    if (!user) return Promise.reject(Messages.USER.ERR.GET);

    // Validar contraseña
    const isMatch = await user.compareField('password', password);
    if (!isMatch) return Promise.reject(Messages.USER.ERR.INVALID_USER);

    // Actualizar tel
    user = await user.updatePhoneNumber(newPhoneNumber, firebaseId);

    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.USER.ERR.UPDATE);
  }
};

/**
 *  Crear nueva contraseña, siempre que sea valida la contraseña anterior
 */
module.exports.changePassword = async function changePassword(
  did, oldPass, newPass,
) {
  if (!did) throw missingDid;
  if (!oldPass) throw missingPassword;
  if (!newPass) throw missingPassword;
  let user;
  try {
    // Obtener usuario y validar contraseña anterior
    user = await getAndValidate(did, oldPass);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }

  try {
    // Actualizar contaraseña
    user = await user.updatePassword(newPass);
    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.USER.ERR.UPDATE);
  }
};

/**
 *  Recuperar contraseña en caso de olvido
 */
module.exports.recoverPassword = async function recoverPassword(
  eMail, newPass,
) {
  if (!eMail) throw missingEmail;
  if (!newPass) throw missingPassword;
  try {
    // Obtener información usuario
    let user = await getByEmail(eMail);
    if (!user) return Promise.reject(Messages.USER.ERR.NOMATCH_USER_EMAIL);

    // Actualizar contaraseña
    user = await user.updatePassword(newPass);
    return Promise.resolve(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.USER.ERR.UPDATE);
  }
};

/**
 *  Normalización del número de teléfono
 */
module.exports.normalizePhone = async function normalizePhone(phone) {
  const user = await getByTel(phone);
  return user ? phone : PhoneNormalization.normalizePhone(phone);
};

/**
 *  Obtener usuario y actualizar imagen
 */
module.exports.saveImage = async function saveImage(did, contentType, path) {
  if (!did) throw missingDid;
  if (!contentType) throw missingContentType;
  if (!path) throw missingPath;
  try {
    // Obtener información de usuario
    const user = await getByDID(did);
    if (!user) return Promise.reject(Messages.USER.ERR.GET);

    // Crear imagen
    const imageId = await createImage(path, contentType);

    // Actualizar imagen del usuario
    await user.updateImage(imageId);

    return Promise.resolve(imageId);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.IMAGE.ERR.CREATE);
  }
};

/**
 *  Obtener imagen de usuario según un id
 */
module.exports.getImage = async function getImage(id) {
  if (!id) throw missingId;
  try {
    const image = await Image.getById(id);
    if (!image) return Promise.reject(Messages.IMAGE.ERR.GET);
    return Promise.resolve(image);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.IMAGE.ERR.GET);
  }
};

/**
 * Obtener usuario a partir de un token
 */
module.exports.verifyUserByToken = async function verifyUserByToken(jwt) {
  if (!jwt) throw missingJwt;
  try {
    const payloadJwt = await getPayload(jwt);
    const { sub } = payloadJwt;
    if (!sub) throw missingDid;
    const user = await User.findOne({ did: sub });
    // @TODO: cambiar por otro mensaje de error
    if (!user) throw Messages.USER.ERR.NOMATCH_USER_DID;
    return user;
  } catch (error) {
    if (error.message) throw error;
    else throw Messages.USER.ERR.VALIDATE;
  }
};
