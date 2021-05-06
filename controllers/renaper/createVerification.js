const Certificate = require('../../models/Certificate');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const UserService = require('../../services/UserService');
const RenaperService = require('../../services/RenaperService');
const FirebaseService = require('../../services/FirebaseService');
const Messages = require('../../constants/Messages');
const AuthRequestService = require('../../services/AuthRequestService');
const ResponseHandler = require('../../utils/ResponseHandler');
const Constants = require('../../constants/Constants');

// eslint-disable-next-line consistent-return
const createVerification = async (req, res) => {
  const { did } = req.body;

  const { dni } = req.body;
  const { gender } = req.body;
  const { name } = req.body;
  const { lastName } = req.body;
  const { birthDate } = req.body;
  const { order } = req.body;

  const { selfieImage } = req.body;
  const { frontImage } = req.body;
  const { backImage } = req.body;

  const fingerPrintData = Constants.FINGER_PRINT_DATA;
  const deviceIp = Constants.SERVER_IP;
  const analyzeAnomalies = Constants.RENAPER_ANALYZE_ANOMALIES;
  const analyzeOcr = Constants.RENAPER_ANALYZE_OCR;

  let operationId;
  let authRequest;
  let user;
  try {
    // Obtener usuario a partir de un did
    user = await UserService.getByDID(did);

    // Iniciar pedido de validación de identidad con el renaper
    operationId = await RenaperService.newOpperation(dni, gender, deviceIp, fingerPrintData);

    // Guardar estado como "en progreso y retornar"
    authRequest = await AuthRequestService.create(operationId, did);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }

  // Retornar el código de operación para que la APP android pueda consultar el estado de la misma
  // y continuar procesando
  ResponseHandler.sendRes(res, {
    status: authRequest.status, operationId: authRequest.operationId,
  });

  try {
    // Agregar frente del dni al pedido
    // eslint-disable-next-line no-console
    console.log(`${operationId} adding dni front data for ${did}`);
    await RenaperService.addFront(
      dni, gender, operationId, frontImage, analyzeAnomalies, analyzeOcr,
    );

    // Agregar dorso del dni al pedido
    // eslint-disable-next-line no-console
    console.log(`${operationId} adding dni back data for ${did}`);
    await RenaperService.addBack(dni, gender, operationId, backImage, analyzeAnomalies, analyzeOcr);

    // Agregar selfie al pedido
    // eslint-disable-next-line no-console
    console.log(`${operationId} adding selfie data for ${did}`);
    await RenaperService.addSelfie(dni, gender, operationId, selfieImage);

    // Agregar código de barras al pedido
    // eslint-disable-next-line no-console
    console.log(`${operationId} adding bar code data for ${did}`);
    await RenaperService.addBarcode(dni, gender, operationId, name, lastName, birthDate, order);

    // Ejecutar pedido
    // eslint-disable-next-line no-console
    console.log(`${operationId} executing request for ${did}`);
    const userData = await RenaperService.endOperation(dni, gender, operationId);

    // Si no hubo match o no se obtuvo la precisión buscada pasar a estado "fallido"
    // Actualizar estado del pedido para que la APP android sepa que la sincronización no fue
    // exitosa
    // eslint-disable-next-line no-console
    console.log(`${operationId} checking results for ${did}`);
    if (
      !userData || !userData.confidence || userData.confidence < Constants.RENAPER_SCORE_TRESHOULD
    ) {
      return authRequest
        .update(Constants.AUTHENTICATION_REQUEST.FALIED, Messages.RENAPER.WEAK_MATCH.message);
    }

    // Generar certificados con la información obtenida
    const data = JSON.parse(userData.personData.person);

    // Cert #1 - Información personal
    const personData = {
      dni: data.number,
      // "gender": data.gender === "M" ? "Hombre" : "Mujer",
      names: data.names,
      lastNames: data.lastNames,
      // "birthdate": data.birthdate,
      // "cuil": data.cuil,
      // "messageOfDeath": data.messageOfDeath,
      nationality: data.nationality,
      // "countryBirth": data.countryBirth
    };

    // eslint-disable-next-line no-console
    console.log(`${operationId} creating certificates for ${did}`);
    const generateCert = CertService.createCertificate(
      did,
      {
        'Datos Personales': {
          preview: { fields: ['dni', 'names', 'lastNames', 'nationality'], type: 2 },
          category: 'identity',
          data: personData,
        },
      },
      data.ExpiryDate,
      Messages.CERTIFICATE.ERR.CREATE,
    );

    // Cert #2 - Dirección
    const addressData = {
      streetAddress: data.streetAddress,
      numberStreet: data.numberStreet,
      floor: data.floor,
      department: data.department,
      zipCode: data.zipCode,
      city: data.city,
      municipality: data.municipality,
      province: data.province,
      country: data.country,
    };

    const generateAditionalCert = CertService.createCertificate(
      did,
      {
        'Domicilio Legal': {
          preview: { fields: ['streetAddress', 'numberStreet', 'zipCode', 'city', 'province', 'country'], type: 1 },
          category: 'identity',
          data: addressData,
        },
      },
      data.ExpiryDate,
      Messages.CERTIFICATE.ERR.CREATE,
    );

    // Crear certificados en paralelo
    const [cert, aditionalCert] = await Promise.all([generateCert, generateAditionalCert]);

    // Enviar en paralelo certificados a mouro para ser guardados
    const saveCert = MouroService.saveCertificate(cert, did);
    const saveAditionalCert = MouroService.saveCertificate(aditionalCert, did);
    const [resCert, resAditionalCert] = await Promise.all([saveCert, saveAditionalCert]);

    try {
      // Enviar push notification
      await FirebaseService.sendPushNotification(
        Messages.PUSH.NEW_CERT.TITLE,
        Messages.PUSH.NEW_CERT.MESSAGE,
        user.firebaseId,
        Messages.PUSH.TYPES.NEW_CERT,
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error sending push notifications:');
    }

    // Agregar info de renaper al usuario
    const addCert = Certificate.generate(
      Constants.CERTIFICATE_NAMES.USER_INFO,
      did,
      Constants.CERTIFICATE_STATUS.UNVERIFIED,
      resCert.data,
      resCert.hash,
    );
    const addAditionalCert = Certificate.generate(
      Constants.CERTIFICATE_NAMES.USER_ADDRESS,
      did,
      Constants.CERTIFICATE_STATUS.UNVERIFIED,
      resAditionalCert.data,
      resAditionalCert.hash,
    );
    await Promise.all([addCert, addAditionalCert]);

    // Actualizar estado del pedido para que la APP android sepa que la sincronización fue exitosa
    await authRequest.update(Constants.AUTHENTICATION_REQUEST.SUCCESSFUL);
  } catch (err) {
    await authRequest.update(Constants.AUTHENTICATION_REQUEST.FALIED, err.message);
  }
};

module.exports = {
  createVerification,
};
