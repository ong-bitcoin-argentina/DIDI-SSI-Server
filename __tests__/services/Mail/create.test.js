const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { create } = require('../../../services/MailService');
const { missingEmail, missingCode } = require('../../../constants/serviceErrors');
const { appData } = require('./constants');

describe('services/Mail/create.test.js', () => {
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

  test('Expect create to throw on missing email', async () => {
    try {
      await create(undefined, 'code', 'did');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect create to throw on missing code', async () => {
    try {
      await create('email', undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  test('Expect create to throw on missing code', async () => {
    try {
      await create('email', undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  test('Expect create success a email', async () => {
    const createResponse = await create(appData.mail, appData.code, appData.did);
    expect(createResponse).not.toBeNull();
  });
});
