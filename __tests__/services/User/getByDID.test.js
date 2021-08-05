const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { getByDID, create } = require('../../../services/UserService');

const { missingDid } = require('../../../constants/serviceErrors');
const { userData, secondDid } = require('./constant');

describe('services/User/getByDID.test.js', () => {
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

  test('Expect getByDID to throw on missing did', async () => {
    try {
      await getByDID(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect getByDID to get user from user Did', async () => {
    const response = await getByDID(user.did);
    expect(response.did).toMatch(user.did);
  });

  test('Expect getByDID to be null user from inexistent user Did', async () => {
    const response = await getByDID(secondDid);
    expect(response).toBe(null);
  });
});
