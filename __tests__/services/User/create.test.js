const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { create } = require('../../../services/UserService');
const {
  missingEmail,
  missingDid,
  missingPrivateKeySeed,
  missingPhoneNumber,
  missingPassword,
  missingFirebaseId,
  missingName,
  missingLastName,
} = require('../../../constants/serviceErrors');
const { userData } = require('./constant');
const Messages = require('../../../constants/Messages');

describe('services/User/emailTaken.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.close();
  });

  test('Expect create to throw on missing did', async () => {
    try {
      await create(undefined, 'privateKeySeed', 'userMail', 'phoneNumber', 'userPass', 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect create to throw on missing privateKeySeed', async () => {
    try {
      await create('did', undefined, 'userMail', 'phoneNumber', 'userPass', 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingPrivateKeySeed.code);
    }
  });

  test('Expect create to throw on missing userMail', async () => {
    try {
      await create('did', 'privateKeySeed', undefined, 'phoneNumber', 'userPass', 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect create to throw on missing phoneNumber', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', undefined, 'userPass', 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect create to throw on missing userPass', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', 'phoneNumber', undefined, 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect create to throw on missing firebaseId', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', 'phoneNumber', 'userPass', undefined, 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingFirebaseId.code);
    }
  });

  test('Expect create to throw on missing name', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', 'phoneNumber', 'userPass', 'firebaseId', undefined, 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect create to throw on missing lastname', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', 'phoneNumber', 'userPass', 'firebaseId', 'name', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingLastName.code);
    }
  });

  test('Expect create to succes', async () => {
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
    const response = await create(
      did,
      privateKeySeed,
      userMail,
      phoneNumber,
      userPass,
      firebaseId,
      name,
      lastname,
    );
    expect(response.did).toMatch(userData.did);
  });

  test('Expect create to throw error on existing user', async () => {
    try {
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
    } catch (e) {
      expect(e.code).toMatch(Messages.USER.ERR.USER_ALREADY_EXIST.code);
      expect(e.message).toMatch(Messages.USER.ERR.USER_ALREADY_EXIST.message);
    }
  });
});
