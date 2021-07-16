const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { getByTel, create } = require('../../../services/UserService');
const { missingPhoneNumber } = require('../../../constants/serviceErrors');
const { userData } = require('./constant');

describe('services/User/getByTel.test.js', () => {
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
    user = await create(
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

  test('Expect getByTel to throw on missing phone number', async () => {
    try {
      await getByTel(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect getByTel to get user from user phone number', async () => {
    const response = await getByTel(userData.phoneNumber);
    expect(response.phoneNumber.encrypted).toMatch(user.phoneNumber.encrypted);
  });

  test('Expect getByTel to response null sending user from inexistent user phone number', async () => {
    const response = await getByTel('+54123654789');
    expect(response).toBe(null);
  });
});
