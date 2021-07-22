const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { changePhoneNumber, create } = require('../../../services/UserService');
const { missingDid, missingPassword, missingPhoneNumber } = require('../../../constants/serviceErrors');
const { userData, secondDid } = require('./constant');
const Messages = require('../../../constants/Messages');

describe('services/User/changePhoneNumber.test.js', () => {
  const newPhoneNumber = '+5432145678';
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

  test('Expect changePhoneNumber to throw on missing did', async () => {
    try {
      await changePhoneNumber(undefined, 'newPhoneNumber', 'password', 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect changePhoneNumber to throw on missing newPhoneNumber', async () => {
    try {
      await changePhoneNumber('did', undefined, 'password', 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect changePhoneNumber to throw on missing password', async () => {
    try {
      await changePhoneNumber('did', 'newPhoneNumber', undefined, 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });
  test('Expect changePhoneNumber to succes', async () => {
    const { did, userPass, firebaseId } = userData;
    const user = await changePhoneNumber(did, newPhoneNumber, userPass, firebaseId);
    const samePass = await user.compareField('phoneNumber', newPhoneNumber);
    expect(samePass).toBe(true);
  });

  test('Expect changePhoneNumber to throw error on wrong did', async () => {
    const { userPass, firebaseId } = userData;
    try {
      await changePhoneNumber(secondDid, newPhoneNumber, userPass, firebaseId);
    } catch (e) {
      expect(e.code).toMatch(Messages.USER.ERR.GET.code);
      expect(e.message).toMatch(Messages.USER.ERR.GET.message);
    }
  });

  test('Expect changePhoneNumber to throw error on wrong password', async () => {
    const { did, firebaseId } = userData;
    try {
      await changePhoneNumber(did, newPhoneNumber, '123456', firebaseId);
    } catch (e) {
      expect(e.code).toMatch(Messages.USER.ERR.INVALID_USER.code);
      expect(e.message).toMatch(Messages.USER.ERR.INVALID_USER.message);
    }
  });
});
