const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { recoverPassword, create } = require('../../../services/UserService');
const { missingPassword, missingEmail } = require('../../../constants/serviceErrors');
const { userData } = require('./constant');
const Messages = require('../../../constants/Messages');

describe('services/User/recoverPassword.test.js', () => {
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

  test('Expect recoverPassword to throw on missing eMail', async () => {
    try {
      await recoverPassword(undefined, 'newPass');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect recoverPassword to throw on missing newPass', async () => {
    try {
      await recoverPassword('eMail', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect recoverPassword to succes', async () => {
    const user = await recoverPassword(userData.userMail, newPassword);
    const samePass = await user.compareField('password', newPassword);
    expect(samePass).toBe(true);
  });

  test('Expect recoverPassword to throw error on wrong email', async () => {
    try {
      await recoverPassword('mail@mail.com', newPassword);
    } catch (e) {
      expect(e.code).toMatch(Messages.USER.ERR.NOMATCH_USER_EMAIL.code);
      expect(e.message).toMatch(Messages.USER.ERR.NOMATCH_USER_EMAIL.message);
    }
  });
});
