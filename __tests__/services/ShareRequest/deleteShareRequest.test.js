/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const { getShareRequestById, saveShareRequest, deleteShareRequest } = require('../../../services/ShareRequestService');
const { MONGO_URL } = require('../../../constants/Constants');
const {
  missingId,
} = require('../../../constants/serviceErrors');
const Messages = require('../../../constants/Messages');

const { jwt, userJWT } = require('./constant');

describe('__tests__/services/ShareRequest/deleteShareRequest.test.js', () => {
  let shareRequest;

  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    shareRequest = await saveShareRequest({ jwt: await jwt });
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('sharerequests');
    await mongoose.connection.close();
  });
  test('Expect deleteShareRequest to throw on missing id', async () => {
    try {
      await deleteShareRequest();
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect deleteShareRequest to success', async () => {
    const { _id: id } = shareRequest;
    await deleteShareRequest(id);
    try {
      await getShareRequestById({ id, userJWT: await userJWT });
    } catch (error) {
      expect(error.code).toBe(Messages.SHAREREQUEST.ERR.NOT_FOUND.code);
    }
  });
});
