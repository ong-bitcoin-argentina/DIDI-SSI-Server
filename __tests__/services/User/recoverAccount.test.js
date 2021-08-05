const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { recoverAccount, create } = require('../../../services/UserService');
const { missingPassword, missingEmail, missingFirebaseId } = require('../../../constants/serviceErrors');
const { userData } = require('./constant');
const Messages = require('../../../constants/Messages');

describe('services/User/recoverAccount.test.js', () => {
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

  test('Expect recoverAccount to throw on missing email', async () => {
    try {
      await recoverAccount(undefined, 'pass', 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect recoverAccount to throw on missing password', async () => {
    try {
      await recoverAccount('email', undefined, 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect recoverAccount to throw on missing firebaseId', async () => {
    try {
      await recoverAccount('email', 'pass', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingFirebaseId.code);
    }
  });

  test('Expect recoverAccount to succes', async () => {
    const { firebaseId, userMail, userPass } = userData;
    const seed = await recoverAccount(userMail, userPass, firebaseId);
    expect(await user.getSeed()).toMatch(seed);
  });

  test('Expect recoverAccount to throw error on wrong email', async () => {
    try {
      const { firebaseId, userPass } = userData;
      await recoverAccount('mail@mail.com', userPass, firebaseId);
    } catch (e) {
      expect(e.code).toMatch(Messages.USER.ERR.NOMATCH_USER_EMAIL.code);
      expect(e.message).toMatch(Messages.USER.ERR.NOMATCH_USER_EMAIL.message);
    }
  });

  test('Expect recoverAccount to throw error on wrong password', async () => {
    try {
      const { firebaseId, userMail } = userData;
      await recoverAccount(userMail, '123456', firebaseId);
    } catch (e) {
      expect(e.code).toMatch(Messages.USER.ERR.INVALID_USER.code);
      expect(e.message).toMatch(Messages.USER.ERR.INVALID_USER.message);
    }
  });
});
