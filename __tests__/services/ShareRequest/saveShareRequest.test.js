const mongoose = require('mongoose');
const ShareRequest = require('../../../models/ShareRequest');
const { decodeJWT } = require('../../../services/BlockchainService');
const { MONGO_URL } = require('../../../constants/Constants');
const { saveShareRequest } = require('../../../services/ShareRequestService');
const Encrypt = require('../../../models/utils/Encryption');
const { missingJwt } = require('../../../constants/serviceErrors');
const { jwt } = require('./constant');

describe('__tests__/services/ShareRequest/saveShareRequest.test.js', () => {
  let shareRequest;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
  });
  afterAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    await ShareRequest.findOneAndDelete({ _id: shareRequest._id });
    await mongoose.connection.close();
  });
  test('Expect saveShareRequest to throw on missing jwt', async () => {
    try {
      await saveShareRequest({ });
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
  test('Expect saveShareRequest to success', async () => {
    const cert = await jwt;
    const { payload } = await decodeJWT(cert);
    shareRequest = await saveShareRequest({ jwt: cert });
    expect(shareRequest.aud).toBe(payload.aud);
    expect(shareRequest.iss).toBe(payload.iss);
    expect(await Encrypt.decript(shareRequest.jwt)).toBe(cert);
  });
});
