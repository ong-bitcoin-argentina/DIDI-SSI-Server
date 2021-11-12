/* eslint-disable no-restricted-globals */
const mongoose = require('mongoose');
const Encrypt = require('./utils/Encryption');

const ShareRequestSchema = new mongoose.Schema({
  jwt: {
    type: String,
    required: true,
  },
  aud: {
    type: String,
  },
  iss: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
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

ShareRequest.deleteById = async function deleteById(_id) {
  try {
    const shareRequest = await ShareRequest.findById(_id);
    shareRequest.delete();
    return shareRequest.save();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

ShareRequest.getAll = async function getAll(limit, page, aud, iss) {
  let totalPages;
  if (limit === 0 || isNaN(limit)) {
    totalPages = 1;
  } else {
    totalPages = Math.ceil(await ShareRequest.find({}).countDocuments() / limit);
  }

  const list = await ShareRequest.find(
    { ...iss ? { iss } : {}, ...aud ? { aud } : {} },
    { iss: 1, aud: 1 },
  )
    .skip(page > 0 ? ((page - 1) * limit) : 0)
    .limit(limit);
  return { list, totalPages };
};
