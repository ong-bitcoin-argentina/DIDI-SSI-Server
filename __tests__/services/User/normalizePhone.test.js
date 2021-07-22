const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { normalizePhone, create } = require('../../../services/UserService');
const { missingPhoneNumber } = require('../../../constants/serviceErrors');
const { userData } = require('./constant');
const Messages = require('../../../constants/Messages');

describe('services/User/normalizePhone.test.js', () => {
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

  test('Expect normalizePhone to throw on missing phone', async () => {
    try {
      await normalizePhone(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect normalizePhone succes', async () => {
    const phone = await normalizePhone(userData.phoneNumber);
    expect(phone).toMatch(userData.phoneNumber);
  });

  test('Expect normalizePhone to throw error on invalid Phone number', async () => {
    try {
      await normalizePhone('+54223123123123');
    } catch (e) {
      expect(e).toMatch(Messages.SMS.INVALID_NUMBER);
    }
  });
});
