const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { sendValidationCode } = require('../../../services/MailService');
const { missingEmail, missingCode } = require('../../../constants/serviceErrors');
const { mailData, errorInvalidEmail } = require('./constants');

describe('services/Mail/sendValidationCode.test.js', () => {
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
    await mongoose.connection.close();
  });

  test('Expect sendValidationCode to throw on missing email', async () => {
    try {
      await sendValidationCode(undefined, 'code');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect sendValidationCode to throw on missing code', async () => {
    try {
      await sendValidationCode('eMail', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  test('Expect sendValidationCode success', async () => {
    const sendValidationCodeResult = await sendValidationCode(mailData.email, mailData.code);
    expect(sendValidationCodeResult.message).toMatch('Queued. Thank you.');
  });

  test('Expect sendValidationCode email invalid', async () => {
    try {
      await sendValidationCode(mailData.invalidEmail, mailData.code);
    } catch (e) {
      expect(e.code).toMatch(errorInvalidEmail.code);
      expect(e.message).toMatch(errorInvalidEmail.message);
    }
  });
});
