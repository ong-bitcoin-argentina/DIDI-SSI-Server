const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { getAndValidate, create } = require('../../../services/UserService');
const { missingDid, missingPassword } = require('../../../constants/serviceErrors');
const { userData, secondDid } = require('./constant');
const Messages = require('../../../constants/Messages');

describe('services/User/getAndValidate.test.js', () => {
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

  test('Expect getAndValidate to throw error on missing did', async () => {
    try {
      await getAndValidate(undefined, 'pass', 'email');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect getAndValidate to throw error on missing password', async () => {
    try {
      await getAndValidate('did', undefined, 'email');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect getAndValidate to succes', async () => {
    const response = await getAndValidate(userData.did, userData.userPass, userData.userMail);
    expect(response.did).toMatch(user.did);
  });

  test('Expect getAndValidate to throw error on inexistent user', async () => {
    try {
      await getAndValidate(secondDid, userData.userPass, 'mail@mail.com');
    } catch (e) {
      expect(e.code).toMatch(Messages.USER.ERR.NOMATCH_USER_DID.code);
      expect(e.message).toMatch(Messages.USER.ERR.NOMATCH_USER_DID.message);
    }
  });

  test('Expect getAndValidate to throw error on invalid password', async () => {
    try {
      await getAndValidate(userData.did, '123456', userData.userMail);
    } catch (e) {
      expect(e.code).toMatch(Messages.USER.ERR.INVALID_USER.code);
      expect(e.message).toMatch(Messages.USER.ERR.INVALID_USER.message);
    }
  });
});
