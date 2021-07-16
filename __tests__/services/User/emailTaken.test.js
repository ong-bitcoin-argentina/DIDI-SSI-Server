const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { emailTaken, create } = require('../../../services/UserService');
const { missingEmail } = require('../../../constants/serviceErrors');
const { userData, errors } = require('./constant');

describe('services/User/emailTaken.test.js', () => {
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

  test('Expect emailTaken to throw on missing mail', async () => {
    try {
      await emailTaken(undefined, 'exeptionDid');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect emailTaken to throw error on email taken', async () => {
    try {
      await emailTaken(userData.userMail);
    } catch (e) {
      expect(e.code).toBe(errors.emailTaken.code);
    }
  });

  test('Expect emailTaken to response undefined sending email not taken', async () => {
    const response = await emailTaken('mail@mail.com');
    expect(response).toBe(undefined);
  });
});
