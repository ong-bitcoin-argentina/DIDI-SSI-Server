const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');

const { missingJwt, missingDid } = require('../../../constants/serviceErrors');
const Messages = require('../../../constants/Messages');
const { verifyUserByToken } = require('../../../services/UserService');
const { token, userToken } = require('../Token/constants');
const { create } = require('../../../services/UserService');
const { userData } = require('./constant');

describe('services/UserService/verifyUserByToken.test', () => {
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

  test('Expect verifyUserByToken to throw on missing jwt', async () => {
    try {
      await verifyUserByToken(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
  test('Expect verifyUserByToken to throw missing did', async () => {
    try {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      await verifyUserByToken(jwt);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
  test('Expect verifyUserByToken to throw Not Match User Id', async () => {
    try {
      const jwt = await token;
      await verifyUserByToken(jwt);
    } catch (e) {
      expect(e.code).toMatch(Messages.USER.ERR.NOMATCH_USER_DID.code);
    }
  });
  test('Expect verifyUserByToken to success', async () => {
    const jwt = await userToken(userData.did);
    const { did } = await verifyUserByToken(jwt);
    expect(did).not.toBe(undefined);
    expect(did).toMatch(userData.did);
  });
});
