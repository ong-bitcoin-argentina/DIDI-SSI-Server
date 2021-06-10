const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { isValid, create } = require('../../../services/MailService');
const { missingEmail, missingCode } = require('../../../constants/serviceErrors');
const { appData, errorData } = require('./constants');
const Hashing = require('../../../models/utils/Hashing');

describe('Should be green', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await create(appData.mail, appData.code, appData.did);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('mails');
    await mongoose.connection.close();
  });
  test('Expect isValid to throw on missing email', async () => {
    try {
      await isValid(undefined, 'code');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect isValid to throw on missing code', async () => {
    try {
      await isValid('email', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  test('Expect isValid success', async () => {
    const isValidResponse = await isValid(appData.mail, appData.code);
    const emailHashing = await Hashing.hash(appData.mail);
    expect(isValidResponse.email.hash).toMatch(emailHashing.hash);
    expect(isValidResponse).not.toBeNull();
  });

  test('Expect isValid not valid', async () => {
    try {
      await isValid(appData.mail, appData.otherCode);
    } catch (e) {
      expect(e.code).toMatch(errorData.code);
      expect(e.message).toMatch(errorData.message);
    }
  });
});
