const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { isValid, create } = require('../../../services/MailService');
const { missingEmail, missingCode } = require('../../../constants/serviceErrors');
const { mailData, errorData } = require('./constants');
const Hashing = require('../../../models/utils/Hashing');

describe('services/Mail/isValid.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await create(mailData.mail, mailData.code, mailData.did);
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
    const isValidResponse = await isValid(mailData.mail, mailData.code);
    const emailHashing = await Hashing.hash(mailData.mail);
    expect(isValidResponse.email.hash).toMatch(emailHashing.hash);
    expect(isValidResponse).not.toBeNull();
  });

  test('Expect isValid not valid', async () => {
    try {
      await isValid(mailData.mail, mailData.otherCode);
    } catch (e) {
      expect(e.code).toMatch(errorData.code);
      expect(e.message).toMatch(errorData.message);
    }
  });
});
