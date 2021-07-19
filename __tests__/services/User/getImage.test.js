/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { getImage, create, saveImage } = require('../../../services/UserService');
const { missingId } = require('../../../constants/serviceErrors');
const { userData, image, errors } = require('./constant');

describe('services/User/getImage.test.js', () => {
  let imageId;
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
    imageId = await saveImage(userData.did, image.contentType, image.path);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.close();
  });

  test('Expect getImage to throw on missing id', async () => {
    try {
      await getImage(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect getImage to success', async () => {
    const response = await getImage(imageId);
    expect(response._id).toStrictEqual(imageId);
  });

  test('Expect getImage to throw on invalidId', async () => {
    try {
      await getImage(`${imageId}123`);
    } catch (e) {
      expect(e.code).toMatch(errors.imageGet.code);
      expect(e.message).toMatch(errors.imageGet.message);
    }
  });
});
