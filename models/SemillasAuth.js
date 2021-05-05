const mongoose = require('mongoose');
const SemillasService = require('../services/SemillasService');

const SemillasAuthSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  modifiedOn: {
    type: Date,
    default: new Date(),
  },
});

const SemillasAuth = mongoose.model('SemillasAuth', SemillasAuthSchema);
module.exports = SemillasAuth;

SemillasAuth.getToken = async function getToken() {
  const data = SemillasAuth.findOne();
  if (data && data.token) {
    return data.token;
  }
  return SemillasAuth.createOrUpdateToken();
};

SemillasAuth.createOrUpdateToken = async function createOrUpdateToken() {
  const query = { token: { $exists: true } };
  const options = { upsert: true, returnOriginal: false };
  const data = await SemillasService.login();
  const updateAction = { $set: { token: data.accessToken, modifiedOn: new Date() } };
  const { token } = await SemillasAuth.findOneAndUpdate(query, updateAction, options);
  return token;
};
