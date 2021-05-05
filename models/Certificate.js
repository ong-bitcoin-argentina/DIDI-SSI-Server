const mongoose = require('mongoose');
const Constants = require('../constants/Constants');
const Encrypt = require('./utils/Encryption');
const EncryptedData = require('./dataTypes/EncryptedData');

const statuses = [
  Constants.CERTIFICATE_STATUS.UNVERIFIED,
  Constants.CERTIFICATE_STATUS.VERIFIED,
  Constants.CERTIFICATE_STATUS.REVOKED,
];

// Registra la informacion del estado de un certificado emitido
const CertificateSchema = new mongoose.Schema({
  userDID: {
    type: String,
    required: true,
  },
  certType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: statuses,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  jwt: EncryptedData,
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

CertificateSchema.index({ userDID: 1, hash: 1 });

// actualizar estado del certificado
CertificateSchema.methods.update = async function update(status) {
  try {
    this.status = status;
    await this.save();
    return Promise.resolve(this);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

// retorna el jwt del certificado
CertificateSchema.methods.getJwt = async function getJwt() {
  return Encrypt.getEncryptedData(this, 'jwt');
};

// retorna el did del dueño del certificado
CertificateSchema.methods.getDid = async function getDid() {
  return this.userDID;
};

const Certificate = mongoose.model('Certificate', CertificateSchema);
module.exports = Certificate;

// inicailizar registro de estado de un certificado
Certificate.generate = async function generate(type, userDID, status, jwt, hash) {
  try {
    let certStatus = await Certificate.findOne({
      userDID,
      hash,
    });
    if (!certStatus) certStatus = new Certificate();
    certStatus.userDID = userDID;
    certStatus.status = status;
    certStatus.hash = hash;
    certStatus.certType = type;
    certStatus.createdOn = new Date();
    await Encrypt.setEncryptedData(certStatus, 'jwt', jwt, true);

    certStatus = await certStatus.save();
    return Promise.resolve(certStatus);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

// retorna el pedido buscandolo por el 'hash' de mouro
Certificate.findByHash = async function findByHash(hash) {
  try {
    const query = { hash };
    const request = await Certificate.findOne(query);
    return Promise.resolve(request);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

// retorna el pedido buscandolo por tipo de certificado (telefono, mail, domicilio, etc)
Certificate.findByType = async function findByType(did, type) {
  try {
    const query = {
      certType: type, userDID: did, status: { $ne: Constants.CERTIFICATE_STATUS.REVOKED },
    };
    const request = await Certificate.find(query);
    return Promise.resolve(request);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};
