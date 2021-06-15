const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { isValidated, create } = require('../../../services/MailService');
const { missingEmail, missingDid } = require('../../../constants/serviceErrors');
const { mailData } = require('./constants');

describe('services/Mail/isValidated.test.js', () => {
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

  test('Expect isValidated to throw on missing did', async () => {
    try {
      await isValidated(undefined, 'email');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect isValidated to throw on missing email', async () => {
    try {
      await isValidated('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect isValidated false', async () => {
    const isValidatedResponse = await isValidated(mailData.did, mailData.mail);
    expect(isValidatedResponse).toBe(false);
  });

  test('Expect isValidated true', async () => {
    const isValidatedResponse = await isValidated(mailData.did, mailData.mail);
    expect(isValidatedResponse).toBe(false);
  });
});
