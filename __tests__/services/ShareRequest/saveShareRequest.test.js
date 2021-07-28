const mongoose = require('mongoose');
const { decodeJWT } = require('did-jwt');
const { MONGO_URL } = require('../../../constants/Constants');
const { saveShareRequest } = require('../../../services/ShareRequestService');
const Encrypt = require('../../../models/utils/Encryption');
const { missingJwt } = require('../../../constants/serviceErrors');
const { jwt } = require('./constant');

describe('__tests__/services/ShareRequest/saveShareRequest.test.js', () => {
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
    await mongoose.connection.db.dropCollection('sharerequests');
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
    const { payload } = decodeJWT(jwt);
    const shareRequest = await saveShareRequest({ jwt });

    expect(shareRequest.aud).toBe(payload.aud);
    expect(shareRequest.iss).toBe(payload.iss);
    expect(await Encrypt.decript(shareRequest.jwt)).toBe(jwt);
  });
});