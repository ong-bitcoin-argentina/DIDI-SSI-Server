const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const User = require('../../../models/User');
const { saveImage } = require('../../../services/UserService');
const { getImageUrl } = require('../../../utils/Helpers');
const { userData, secondDid, image } = require('./constants');

describe('models/User/getByDID.test.js', () => {
  let user;
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
    user = await User.generate(
      did,
      privateKeySeed,
      userMail,
      phoneNumber,
      userPass,
      firebaseId,
      name,
      lastname,
    );
    await saveImage(did, image.contentType, image.path);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('images');
    await mongoose.connection.close();
  });

  test('Expect null on missing did', async () => {
    const response = await User.getByDID(undefined);
    expect(response).toBe(null);
  });

  test('Expect getByDID to get user from user Did', async () => {
    const response = await User.getByDID(user.did);
    expect(response.did).toMatch(user.did);
    expect(response.imageId).not.toBe(null);
  });

  test('Expect getByDID to get user with image from user Did', async () => {
    await saveImage(userData.did, image.contentType, image.path);
    const response = await User.getByDID(user.did);
    expect(response.did).toMatch(user.did);
    expect(response.imageId).not.toBe(null);
    expect(response.imageUrl).toBe(getImageUrl(response.imageId));
  });

  test('Expect getByDID to be null user from inexistent user Did', async () => {
    const response = await User.getByDID(secondDid);
    expect(response).toBe(null);
  });
});
