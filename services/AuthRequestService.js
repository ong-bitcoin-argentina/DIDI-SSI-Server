const Messages = require('../constants/Messages');
const AuthRequest = require('../models/AuthRequest');
const {
  missingOperationId,
  missingUserDID,
  missingDid,
  missingErrMsg,
  missingStatus,
} = require('../constants/serviceErrors');

/**
 *  Crea y guarda pedido de validación de identidad
 */
module.exports.create = async function create(operationId, userDID) {
  if (!operationId) throw missingOperationId;
  if (!userDID) throw missingUserDID;
  try {
    const authRequest = await AuthRequest.generate(operationId, userDID);
    if (!authRequest) return Promise.reject(Messages.RENAPER.CREATE);
    return Promise.resolve(authRequest);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};

/**
 *  Obtiene el pedido de validación a partir del código de operación
 */
module.exports.getByOperationId = async function getByOperationId(operationId) {
  if (!operationId) throw missingOperationId;
  try {
    const authRequest = await AuthRequest.findByOperationId(operationId);
    if (!authRequest) throw Messages.RENAPER.GET;
    return authRequest;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw Messages.COMMUNICATION_ERROR;
  }
};

/**
 *  Indica si un determinado did posee una solicitud exitosa contra renaper
 */
module.exports.getByDID = async function getByDID(did) {
  if (!did) throw missingDid;
  try {
    const result = await AuthRequest.findByDid(did);
    if (!result) return null;
    const { createdOn, operationId, status } = result;
    return { createdOn, operationId, status };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw Messages.COMMUNICATION_ERROR;
  }
};

/**
 *  Actualiza el pedido de validación
 */
module.exports.update = async function update(status, errMsg) {
  if (!status) throw missingStatus;
  if (!errMsg) throw missingErrMsg;
  try {
    // TODO: Fix operationId
    // eslint-disable-next-line no-undef
    let authRequest = await AuthRequest.findByOperationId(operationId);
    if (!authRequest) return Promise.reject(Messages.RENAPER.GET);
    authRequest = await authRequest.update(status, errMsg);
    if (!authRequest) return Promise.reject(Messages.RENAPER.UPDATE);
    return Promise.resolve(authRequest);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(Messages.COMMUNICATION_ERROR);
  }
};
