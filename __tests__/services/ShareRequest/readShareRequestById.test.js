/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const { getShareRequestById, saveShareRequest } = require('../../../services/ShareRequestService');
const { MONGO_URL } = require('../../../constants/Constants');
const {
  missingId, missingUserJWT,
} = require('../../../constants/serviceErrors');
const { jwt } = require('./constant');

describe('__tests__/services/ShareRequest/readShareRequestById.test.js', () => {
  let shareRequest;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    shareRequest = await saveShareRequest({ jwt });
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('sharerequests');
    await mongoose.connection.close();
  });
  test('Expect getShareRequestById to throw on missing id', async () => {
    try {
      await getShareRequestById({ id: undefined, userJWT: 'userJWT' });
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect getShareRequestById to throw on missing userJWT', async () => {
    try {
      await getShareRequestById({ id: 'id', userJWT: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingUserJWT.code);
    }
  });

  test('Expect getShareRequestById to success', async () => {
    const result = await getShareRequestById({ id: shareRequest._id, userJWT: jwt });
    expect(result).toMatch(jwt);
  });
});
