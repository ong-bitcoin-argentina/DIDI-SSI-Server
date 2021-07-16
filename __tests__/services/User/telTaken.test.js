const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { telTaken, create } = require('../../../services/UserService');
const { missingPhoneNumber } = require('../../../constants/serviceErrors');
const { userData, errors } = require('./constant');

describe('services/User/telTaken.test.js', () => {
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

  test('Expect telTaken to throw on missing phoneNumber', async () => {
    try {
      await telTaken(undefined, 'exeptionDid');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect telTaken to throw error on email taken', async () => {
    try {
      await telTaken(userData.phoneNumber);
    } catch (e) {
      expect(e.code).toBe(errors.telTaken.code);
      expect(e.message).toBe(errors.telTaken.message);
    }
  });

  test('Expect telTaken to response undefined sending email not taken', async () => {
    const response = await telTaken('+54123512548');
    expect(response).toBe(false);
  });
});
