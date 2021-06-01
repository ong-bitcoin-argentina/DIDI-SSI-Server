const { Credentials } = require('uport-credentials');

const EthrDID = require('ethr-did');
const { decodeJWT, createJWT, SimpleSigner } = require('did-jwt');
const { createVerifiableCredential, verifyCredential } = require('did-jwt-vc');
// TODO: FIX
// eslint-disable-next-line import/no-extraneous-dependencies
const { Resolver } = require('did-resolver');
const { getResolver } = require('ethr-did-resolver');
const Certificate = require('../models/Certificate');
const BlockchainService = require('./BlockchainService');
const Messages = require('../constants/Messages');
const Constants = require('../constants/Constants');

const resolver = new Resolver(getResolver(Constants.BLOCKCHAIN.PROVIDER_CONFIG));
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
      iss: `did:ethr:${Constants.SERVER_DID}`,
      exp,
      callback: cb,
      claims,
      type: 'shareReq',
    };

    // TODO: FIX
    // eslint-disable-next-line no-undef
    const credentials = new Credentials({ did: `did:ethr:${Constants.SERVER_DID}`, signer, resolver });
    const petition = await credentials.signJWT(payload);
    // eslint-disable-next-line no-console
    if (Constants.DEBUGG) console.log(petition);
    const result = module.exports.createShareRequest(did, petition);
    return Promise.resolve(result);
  } catch (err) {
    // eslint-disable-next-line no-console
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
  const signer = SimpleSigner(Constants.SERVER_PRIVATE_KEY);
  const payload = { sub: did, disclosureRequest: jwt };
  const token = await createJWT(payload, { alg: 'ES256K-R', issuer: `did:ethr:${Constants.SERVER_DID}`, signer });
  return token;
};

/**
 *  Genera un certificado asociando la información recibida en "subject" con el did
 */
module.exports.createCertificate = async function createCertificate(did, subject, expDate, errMsg) {
  if (!did) throw missingDid;
  if (!subject) throw missingSubject;
  if (!errMsg) throw missingErrMsg;
  const vcissuer = new EthrDID({
    address: Constants.SERVER_DID,
    privateKey: Constants.SERVER_PRIVATE_KEY,
  });

  // eslint-disable-next-line no-bitwise
  const date = (new Date(expDate).getTime() / 1000) | 0;

  const vcPayload = {
    sub: did,
    vc: {
      '@context': [Constants.CREDENTIALS.CONTEXT],
      type: [Constants.CREDENTIALS.TYPES.VERIFIABLE],
      credentialSubject: subject,
    },
  };

  vcPayload.exp = date;

  try {
    const result = await createVerifiableCredential(vcPayload, vcissuer);
    // eslint-disable-next-line no-console
    console.log(Messages.CERTIFICATE.CREATED);
    // eslint-disable-next-line no-console
    if (Constants.DEBUGG) console.log(result);
    return Promise.resolve(result);
  } catch (err) {
    // eslint-disable-next-line no-console
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
    const result = await decodeJWT(jwt);
    return Promise.resolve(result);
  } catch (err) {
    // eslint-disable-next-line no-console
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
    const result = await verifyCredential(jwt, resolver);
    result.status = Constants.CERTIFICATE_STATUS.UNVERIFIED;
    const cert = await Certificate.findByHash(hash);
    if (cert) result.status = cert.status;

    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return new Error(errMsg);
  }
};

/**
 * Dado un emisor de un certificado, verifica su validez
 */
module.exports.verifyIssuer = async function verifyIssuer(issuerDid) {
  if (!issuerDid) throw missingIssuerDid;
  // eslint-disable-next-line no-console
  console.log('Validating delegate...');
  if (issuerDid === `did:ethr:${Constants.SERVER_DID}`) {
    return true;
  }
  const delegated = await BlockchainService.validDelegate(issuerDid);
  // eslint-disable-next-line no-console
  console.log('Delegate verified!');
  if (delegated) return Messages.CERTIFICATE.VERIFIED;
  throw Messages.ISSUER.ERR.IS_INVALID;
};
