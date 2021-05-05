/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const Hashing = require('./utils/Hashing');
const Encrypt = require('./utils/Encryption');
const EncryptedData = require('./dataTypes/EncryptedData');
const HashedData = require('./dataTypes/HashedData');

const Constants = require('../constants/Constants');

// Registra los pedidos de validacion de mails
const MailSchema = new mongoose.Schema({
  email: EncryptedData,
  did: {
    type: String,
  },
  code: HashedData,
  validated: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  expiresOn: {
    type: Date,
  },
});

const Mail = mongoose.model('Mail', MailSchema);

MailSchema.index(
  { 'email.encrypted': 1 },
  {
    unique: true,
  },
);

// verificar si el pedido de validacion de telefono expirò
MailSchema.methods.expired = function expired() {
  return this.expiresOn.getTime() < new Date().getTime();
};

// comparar codigos de validacion
MailSchema.methods.isValid = async function isValid(code) {
  try {
    const isMatch = await Hashing.validateHash(code, this.code);
    return Promise.resolve(isMatch);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

// comparar codigos de validacion y actualizar flag "validated"
MailSchema.methods.validateMail = async function validateMail(did) {
  try {
    this.did = did;

    const quiery = { _id: this._id };
    const action = { $set: { validated: true, did: this.did } };

    await Mail.findOneAndUpdate(quiery, action);

    this.validated = true;
    return Promise.resolve(this);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

// retorna el mail a validar
MailSchema.methods.getMail = async function getMail() {
  return Encrypt.getEncryptedData(this, 'email');
};

// retorna el did al que fue dirigido el pedido de validacion
MailSchema.methods.getDid = async function getDid() {
  return this.did;
};

module.exports = Mail;

// crear nuevo pedido de validacion de mail, o pisar el anterior si hay otro con el mismo did
Mail.generate = async function generate(email, code, did) {
  try {
    const hashData = await Hashing.hash(email);
    const query = { 'email.hash': hashData.hash };
    let mail = await Mail.findOne(query);

    if (!mail) mail = new Mail();

    mail.validated = false;
    mail.createdOn = new Date();

    const date = new Date();
    if (did) this.did = did;
    date.setHours(date.getHours() + Constants.HOURS_BEFORE_CODE_EXPIRES);
    mail.expiresOn = date;
    await Encrypt.setEncryptedData(mail, 'email', email);
    mail.code = await Hashing.saltedHash(code);

    mail = await mail.save();
    return Promise.resolve(mail);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

// obtener pedido de validacion de mail no validado correspondiente a ese mail
Mail.getByEmail = async function getByEmail(email) {
  try {
    const hashData = await Hashing.hash(email);
    const query = { 'email.hash': hashData.hash, validated: false };
    const mail = await Mail.findOne(query);
    return Promise.resolve(mail);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

// retorna true si el mail fue validado para ese did
Mail.isValidated = async function isValidated(did, email) {
  try {
    const hashData = await Hashing.hash(email);
    const query = { did, 'email.hash': hashData.hash };
    const mail = await Mail.findOne(query);

    return Promise.resolve(mail ? mail.validated : false);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};
