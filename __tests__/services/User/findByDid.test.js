const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { findByDid, create } = require('../../../services/UserService');

const { missingDid } = require('../../../constants/serviceErrors');
const { userData, secondDid, errors } = require('./constant');

describe('services/User/findByDid.test.js', () => {
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

  test('Expect findByDid to throw on missing did', async () => {
    try {
      await findByDid(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect findByDid to get user from user Did', async () => {
    const response = await findByDid(user.did);
    expect(response.did).toMatch(user.did);
  });

  test('Expect getByDID to throw error sending user from inexistent user Did', async () => {
    try {
      await findByDid(secondDid);
    } catch (e) {
      expect(e.code).toMatch(errors.missingDid.code);
      expect(e.message).toMatch(errors.missingDid.message);
    }
  });
});
