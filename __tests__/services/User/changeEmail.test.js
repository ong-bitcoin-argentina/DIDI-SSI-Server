const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { changeEmail, create } = require('../../../services/UserService');
const { missingDid, missingEmail, missingPassword } = require('../../../constants/serviceErrors');
const { userData, errors, secondDid } = require('./constant');

describe('services/User/changeEmail.test.js', () => {
  const newEmail = 'newmail@newmail.com';
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

  test('Expect changeEmail to throw on missing did', async () => {
    try {
      await changeEmail(undefined, 'newMail', 'password');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect changeEmail to throw on missing newMail', async () => {
    try {
      await changeEmail('did', undefined, 'password');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect changeEmail to throw on missing password', async () => {
    try {
      await changeEmail('did', 'newMail', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect changeEmail to succes', async () => {
    const { did, userPass } = userData;
    const user = await changeEmail(did, newEmail, userPass);
    const sameEmail = await user.compareField('mail', newEmail);
    expect(sameEmail).toBe(true);
  });

  test('Expect changeEmail to throw error on wrong did', async () => {
    try {
      await changeEmail(secondDid, newEmail, userData.userPass);
    } catch (e) {
      expect(e.code).toMatch(errors.getUser.code);
      expect(e.message).toMatch(errors.getUser.message);
    }
  });

  test('Expect changeEmail to throw error on wrong password', async () => {
    try {
      await changeEmail(userData.did, newEmail, '123456');
    } catch (e) {
      expect(e.code).toMatch(errors.invalidPassword.code);
      expect(e.message).toMatch(errors.invalidPassword.message);
    }
  });
});
