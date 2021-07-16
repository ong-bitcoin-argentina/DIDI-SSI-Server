const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { getByEmail, create } = require('../../../services/UserService');
const { missingEmail } = require('../../../constants/serviceErrors');
const { userData, secondDid, errors } = require('./constant');

describe('services/User/getByEmail.test.js', () => {
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

  test('Expect getByEmail to throw on missing email', async () => {
    try {
      await getByEmail(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect getByEmail to get user from user email', async () => {
    const response = await getByEmail(userData.userMail);
    expect(response.mail.encrypted).toBe(user.mail.encrypted);
  });

  test.skip('Expect getByDID to throw error sending user from inexistent user Did', async () => {
    try {
      await getByEmail(secondDid);
    } catch (e) {
      expect(e.code).toMatch(errors.missingDid.code);
      expect(e.message).toMatch(errors.missingDid.message);
    }
  });
});
