const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { emailTaken, create } = require('../../../services/UserService');
const { missingEmail } = require('../../../constants/serviceErrors');
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

  test('Expect emailTaken to throw on missing mail', async () => {
    try {
      await emailTaken(undefined, 'exceptionDid');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect emailTaken to response undefined sending email taken and exceptionDid', async () => {
    const response = await emailTaken(userData.userMail, userData.did);
    expect(response).toBe(undefined);
  });

  test('Expect emailTaken to throw error on email taken', async () => {
    try {
      await emailTaken(userData.userMail);
    } catch (e) {
      expect(e.code).toBe(Messages.USER.ERR.EMAIL_TAKEN.code);
      expect(e.message).toBe(Messages.USER.ERR.EMAIL_TAKEN.message);
    }
  });

  test('Expect emailTaken to response undefined sending email not taken', async () => {
    const response = await emailTaken('mail@mail.com');
    expect(response).toBe(undefined);
  });
});
