const fetch = require('node-fetch');
const Constants = require('../constants/Constants');
const Messages = require('../constants/Messages');

/**
 *  Realiza un post al servicio de renaper con la url interna y el body recibidos
 */
const renaperPost = async function renaperPost(url, body) {
  try {
    const response = await fetch(Constants.RENAPER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: Constants.RENAPER_API_KEY,
        url,
      },
      body,
    });

    const jsonResp = await response.json();
    return jsonResp.status === 'error' ? Promise.reject(jsonResp) : Promise.resolve(jsonResp);
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *  Realiza un post al servicio de renaper cargando la info del codigo de barras
 */
module.exports.scanBarcode = async function scanBarcode(file) {
  try {
    const result = await renaperPost(
      Constants.RENAPER_URLS.SCAN_BAR_CODE,
      JSON.stringify({
        file,
      }),
    );
    return Promise.resolve(result.data);
  } catch (err) {
    return Promise.reject(Messages.RENAPER.SCAN_BAR_CODE);
  }
};

/**
 *  Realiza un post al servicio de renaper iniciando todo el proceso de validación
 */
module.exports.newOpperation = async function newOpperation(
  dni, gender, deviceIp, fingerprintData,
) {
  try {
    const result = await renaperPost(
      Constants.RENAPER_URLS.NEW_OPERATION,
      JSON.stringify({
        number: dni,
        gender,
        ipAddress: deviceIp,
        applicationVersion: Constants.RENAPER_APP_VERS,
        browserFingerprintData: fingerprintData,
      }),
    );
    return Promise.resolve(result.operationId);
  } catch (err) {
    return Promise.reject(Messages.RENAPER.NEW_OPERATION);
  }
};

/**
 *  Realiza un post al servicio de renaper agregando frente del dni
 */
module.exports.addFront = async function newOpperation(
  dni, gender, operationId, frontImage, analyzeAnomalies, analyzeOcr,
) {
  try {
    const result = await renaperPost(
      Constants.RENAPER_URLS.ADD_FRONT,
      JSON.stringify({
        number: dni,
        gender,
        operationId,
        file: frontImage,
        analyzeAnomalies,
        analyzeOcr,
      }),
    );
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(Messages.RENAPER.ADD_FRONT);
  }
};

/**
 *  Realiza un post al servicio de renaper agregando dorso del dni
 */
module.exports.addBack = async function addBack(
  dni, gender, operationId, backImage, analyzeAnomalies, analyzeOcr,
) {
  try {
    const result = await renaperPost(
      Constants.RENAPER_URLS.ADD_BACK,
      JSON.stringify({
        number: dni,
        gender,
        operationId,
        file: backImage,
        analyzeAnomalies,
        analyzeOcr,
      }),
    );
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(Messages.RENAPER.ADD_BACK);
  }
};

/**
 *  Realiza un post al servicio de renaper agregando selfie
 */
module.exports.addSelfie = async function addSelfie(dni, gender, operationId, selfie) {
  try {
    const result = await renaperPost(
      Constants.RENAPER_URLS.ADD_SELFIE,
      JSON.stringify({
        number: dni,
        gender,
        operationId,
        selfieList: [{ file: selfie, imageType: 'SN' }],
      }),
    );
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(Messages.RENAPER.ADD_SELFIE);
  }
};

/**
 *  Realiza un post al servicio de renaper agregando código de barras
 */
module.exports.addBarcode = async function addBarcode(
  dni, gender, operationId, name, lastName, birthDate, order,
) {
  const document = {
    names: name,
    lastNames: lastName,
    number: dni,
    birthdate: birthDate,
    gender,
    order,
  };

  try {
    const result = await renaperPost(
      Constants.RENAPER_URLS.ADD_BAR_CODE,
      JSON.stringify({
        number: dni,
        gender,
        operationId,
        document,
      }),
    );
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(Messages.RENAPER.ADD_BAR_CODE);
  }
};

/**
 *  Realiza un post al servicio de renaper ejecutando
 *  el proceso con toda la información previamente cargada
 */
module.exports.endOperation = async function endOperation(dni, gender, operationId) {
  try {
    const result = await renaperPost(
      Constants.RENAPER_URLS.END_OPERATION,
      JSON.stringify({
        number: dni,
        gender,
        operationId,
      }),
    );
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(Messages.RENAPER.END_OPERATION);
  }
};
