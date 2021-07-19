const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { saveImage, create } = require('../../../services/UserService');
const { missingDid, missingContentType, missingPath } = require('../../../constants/serviceErrors');
const { userData, image, errors } = require('./constant');

describe('services/User/saveImage.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    const {
      did,
      privateKeySeed,
      userMail,
      phoneNumber,
      userPass,
      firebaseId,
      name,
      lastname,
    } = userData;
    await create(
      did,
      privateKeySeed,
      userMail,
      phoneNumber,
      userPass,
      firebaseId,
      name,
      lastname,
    );
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.close();
  });

  test('Expect saveImage to throw on missing did', async () => {
    try {
      await saveImage(undefined, 'contentType', 'path');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect saveImage to throw on missing contentType', async () => {
    try {
      await saveImage('did', undefined, 'path');
    } catch (e) {
      expect(e.code).toMatch(missingContentType.code);
    }
  });

  test('Expect saveImage to throw on missing path', async () => {
    try {
      await saveImage('did', 'contentType', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPath.code);
    }
  });

  test('Expect saveImage to success', async () => {
    const response = await saveImage(userData.did, image.contentType, image.path);
    expect(response).not.toBe(null);
  });

  test('Expect saveImage to throw error on invalid path', async () => {
    try {
      await saveImage(userData.did, image.contentType, `${image.path}/`);
    } catch (e) {
      expect(e.code).toMatch(errors.imageCreate.code);
      expect(e.message).toMatch(errors.imageCreate.message);
    }
  });
});
