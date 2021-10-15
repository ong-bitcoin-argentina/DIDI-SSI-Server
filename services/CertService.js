/* eslint-disable no-console */
const Certificate = require('../models/Certificate');
const BlockchainService = require('./BlockchainService');
const Messages = require('../constants/Messages');
const Constants = require('../constants/Constants');

const {
  missingDid,
  missingPhoneNumber,
  missingEmail,
  missingCallback,
  missingClaims,
  missingJwt,
  missingSubject,
  missingErrMsg,
  missingIssuerDid,
} = require('../constants/serviceErrors');

const serverDid = `did:ethr:${Constants.SERVER_DID}`;
const privateKey = Constants.SERVER_PRIVATE_KEY;

/**
 *  Crea un nuevo certificado que valida la propiedad
 *  del número de teléfono por parte del dueño del did
 */
module.exports.createPhoneCertificate = async function createPhoneCertificate(did, phoneNumber) {
  if (!did) throw missingDid;
  if (!phoneNumber) throw missingPhoneNumber;
  const subject = {
    Phone: {
      preview: {
        type: 0,
        fields: ['phoneNumber'],
      },
      category: 'identity',
      data: {
        phoneNumber,
      },
    },
  };
  return module.exports.createCertificate(did, subject, undefined, Messages.SMS.ERR.CERT.CREATE);
};

/**
 *  Crea un nuevo certificado que valida la propiedad
 *  del del mail por parte del dueño del did
 */
module.exports.createMailCertificate = async function createMailCertificate(did, email) {
  if (!did) throw missingDid;
  if (!email) throw missingEmail;
  const subject = {
    Email: {
      preview: {
        type: 0,
        fields: ['email'],
      },
      category: 'identity',
      data: {
        email,
      },
    },
  };
  return module.exports.createCertificate(did, subject, undefined, Messages.EMAIL.ERR.CERT.CREATE);
};

/**
 *  Genera un certificado pidiendo info a determinado usuario
 */
module.exports.createPetition = async function createPetition(did, claims, cb) {
  if (!did) throw missingDid;
  if (!claims) throw missingClaims;
  if (!cb) throw missingCallback;
  try {
    // eslint-disable-next-line no-bitwise
    const exp = ((new Date().getTime() + 600000) / 1000) | 0;

    const payload = {
      iss: serverDid,
      exp,
      callback: cb,
      claims,
      type: 'shareReq',
    };
    const credentials = await BlockchainService.createJWT(serverDid, privateKey, payload, exp);
    if (Constants.DEBUGG) console.log(credentials);
    const result = module.exports.createShareRequest(did, credentials);
    return Promise.resolve(result);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 *  Genera un token a partir de un did y su información
 */
module.exports.createShareRequest = async function createShareRequest(did, jwt) {
  if (!did) throw missingDid;
  if (!jwt) throw missingJwt;
  const payload = { sub: did, disclosureRequest: jwt };
  const token = await BlockchainService.createJWT(
    serverDid,
    privateKey,
    payload,
    undefined,
  );
  return token;
};

/**
 *  Genera un certificado asociando la información recibida en "subject" con el did
 */
module.exports.createCertificate = async function createCertificate(did, subject, expDate, errMsg) {
  if (!did) throw missingDid;
  if (!subject) throw missingSubject;
  if (!errMsg) throw missingErrMsg;

  try {
    const result = await BlockchainService.createVerifiableCredential(
      did, subject, expDate, serverDid, privateKey,
    );
    if (Constants.DEBUGG) {
      console.log(Messages.CERTIFICATE.CREATED);
      console.log(result);
    }
    return Promise.resolve(result);
  } catch (err) {
    console.log(err);
    return Promise.reject(errMsg);
  }
};

/**
 *  Verifica la validez del certificado para el certificado de número de mail
 */
module.exports.verifyCertificateEmail = async function verifyCertificateEmail(jwt, hash) {
  if (!jwt) throw missingJwt;
  const result = await module.exports.verifyCertificate(jwt, hash, Messages.CERTIFICATE.ERR.VERIFY);
  return result;
};

/**
 *  Verifica la validez del certificado para el certificado de número de teléfono
 */
module.exports.verifyCertificatePhoneNumber = async function verifyCertificatePhoneNumber(
  jwt, hash,
) {
  if (!jwt) throw missingJwt;
  const result = await module.exports.verifyCertificate(jwt, hash, Messages.CERTIFICATE.ERR.VERIFY);
  return result;
};

/**
 *  Decodifica el certificado, retornando la info
 *  (independientemente de si el certificado es válido o no)
 */
module.exports.decodeCertificate = async function decodeCertificate(jwt, errMsg) {
  if (!jwt) throw missingJwt;
  if (!errMsg) throw missingErrMsg;
  try {
    const result = await BlockchainService.decodeJWT(jwt);
    return Promise.resolve(result);
  } catch (err) {
    console.log(err);
    return Promise.reject(errMsg);
  }
};

/**
 *  Analiza la validez del certificado, su formato, emisor, etc
 *  retorna la info del certificado y su estado
 */
module.exports.verifyCertificate = async function verifyCertificate(jwt, hash, errMsg) {
  if (!jwt) throw missingJwt;
  if (!errMsg) throw missingErrMsg;
  try {
    const result = await BlockchainService.verifyCertificate(jwt);
    result.status = Constants.CERTIFICATE_STATUS.UNVERIFIED;
    if (hash) {
      const cert = await Certificate.findByHash(hash);
      if (cert) result.status = cert.status;
    }

    return result;
  } catch (err) {
    console.log(err);
    return new Error(errMsg);
  }
};

/**
 * Dado un emisor de un certificado, verifica su validez
 */
module.exports.verifyIssuer = async function verifyIssuer(issuerDid) {
  if (!issuerDid) throw missingIssuerDid;
  if (await BlockchainService.compareDid(issuerDid, serverDid)) {
    return Messages.CERTIFICATE.VERIFIED;
  }
  const delegated = await BlockchainService.validDelegate(issuerDid);
  if (delegated) return Messages.CERTIFICATE.VERIFIED;
  throw Messages.ISSUER.ERR.IS_INVALID;
};
