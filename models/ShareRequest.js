const mongoose = require('mongoose');
const Encrypt = require('./utils/Encryption');

const ShareRequestSchema = new mongoose.Schema({
  jwt: {
    type: String,
    required: true,
  },
  aud: {
    type: String,
    required: true,
  },
  iss: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: { expires: '60m' },
  },
});

const ShareRequest = mongoose.model('ShareRequest', ShareRequestSchema);
module.exports = ShareRequest;

ShareRequest.generate = async function generate({ jwt, ...rest }) {
  try {
    const jwtEncrypted = await Encrypt.encrypt(jwt);
    return ShareRequest.create({ jwt: jwtEncrypted, ...rest });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

ShareRequest.getById = async function getById(_id) {
  const shareRequest = await ShareRequest.findById(_id);
  if (shareRequest) {
    const jwtDecripted = await Encrypt.decript(shareRequest.jwt);
    shareRequest.jwt = jwtDecripted;
  }
  return shareRequest;
};
