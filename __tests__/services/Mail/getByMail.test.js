const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { getByMail, create } = require('../../../services/MailService');
const { missingEmail } = require('../../../constants/serviceErrors');
const { mailData, noValidations } = require('./constants');

describe('services/Mail/getByMail.test.js', () => {
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

  test('Expect getByMail to throw on missing email', async () => {
    try {
      await getByMail(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect getByMail success', async () => {
    const getByEmailResponse = await getByMail(mailData.mail);
    expect(getByEmailResponse).not.toBeNull();
  });

  test('Expect getByMail to throw on missing email', async () => {
    try {
      await getByMail(mailData.otherMail);
    } catch (e) {
      expect(e.code).toMatch(noValidations.code);
      expect(e.message).toMatch(noValidations.message);
    }
  });
});
