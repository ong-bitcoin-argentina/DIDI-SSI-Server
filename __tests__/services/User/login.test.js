const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { login, create } = require('../../../services/UserService');
const { missingDid, missingEmail } = require('../../../constants/serviceErrors');
const { userData, errors } = require('./constant');

describe('services/User/login.test.js', () => {
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

  test('Expect login to throw on missing did', async () => {
    try {
      await login(undefined, 'email', 'pass');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect login to throw on missing email', async () => {
    try {
      await login('did', undefined, 'pass');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect login to succes', async () => {
    const { did, userMail, userPass } = userData;
    const user = await login(did, userMail, userPass);
    expect(user.did).toMatch(did);
  });

  test('Expect login to throw error on wrong email', async () => {
    try {
      const { did, userPass } = userData;
      await login(did, 'mail@mail.com', userPass);
    } catch (e) {
      expect(e.code).toMatch(errors.invalidLogin.code);
      expect(e.message).toMatch(errors.invalidLogin.message);
    }
  });

  test('Expect login to throw error on wrong password', async () => {
    try {
      const { did, userMail } = userData;
      await login(did, userMail, '123456');
    } catch (e) {
      expect(e.code).toMatch(errors.invalidLogin.code);
      expect(e.message).toMatch(errors.invalidLogin.message);
    }
  });
});
