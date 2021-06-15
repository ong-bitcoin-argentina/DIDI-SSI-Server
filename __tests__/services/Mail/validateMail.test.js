const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { validateMail, create, isValid } = require('../../../services/MailService');
const { missingEmail, missingDid } = require('../../../constants/serviceErrors');
const { mailData, communicationError } = require('./constants');

describe('services/Mail/validateMail.test.js', () => {
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
  test('Expect validateMail to throw on missing mail', async () => {
    try {
      await validateMail(undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect validateMail to throw on missing did', async () => {
    try {
      await validateMail('mail', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect validateMail success', async () => {
    const isValidResult = await isValid(mailData.mail, mailData.code);
    const validateMailResult = await validateMail(isValidResult, mailData.mail);
    expect(validateMailResult.validated).toBeTruthy();
  });

  test('Expect validateMail communication error', async () => {
    try {
      const isValidResult = await isValid(mailData.mail, mailData.otherCode);
      await validateMail(isValidResult, mailData.mail);
    } catch (e) {
      expect(e.code).toMatch(communicationError.code);
      expect(e.message).toMatch(communicationError.message);
    }
  });
});
