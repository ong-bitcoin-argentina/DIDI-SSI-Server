const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { changePassword, create } = require('../../../services/UserService');
const { missingDid, missingPassword } = require('../../../constants/serviceErrors');
const { userData, errors, secondDid } = require('./constant');

describe('services/User/changePassword.test.js', () => {
  const newPassword = '123456';
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

  test('Expect changePassword to throw on missing did', async () => {
    try {
      await changePassword(undefined, 'oldPass', 'newPass');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect changePassword to throw on missing oldPass', async () => {
    try {
      await changePassword('did', undefined, 'newPass');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect changePassword to throw on missing newPass', async () => {
    try {
      await changePassword('did', 'oldPass', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect changePassword to succes', async () => {
    const { did, userPass } = userData;
    const user = await changePassword(did, userPass, newPassword);
    const samePass = await user.compareField('password', newPassword);
    expect(samePass).toBe(true);
  });

  test('Expect changePassword to throw error on wrong did', async () => {
    try {
      await changePassword(secondDid, userData.userPass, newPassword);
    } catch (e) {
      expect(e.code).toMatch(errors.noMatchUserDid.code);
      expect(e.message).toMatch(errors.noMatchUserDid.message);
    }
  });

  test('Expect changePassword to throw error on wrong password', async () => {
    try {
      await changePassword(userData.did, userData.userPass, newPassword);
    } catch (e) {
      expect(e.code).toMatch(errors.invalidPassword.code);
      expect(e.message).toMatch(errors.invalidPassword.message);
    }
  });
});
