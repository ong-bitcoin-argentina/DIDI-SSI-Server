const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { create } = require('../../../services/MailService');
const { missingEmail, missingCode } = require('../../../constants/serviceErrors');
const { mailData } = require('./constants');
const Encrypt = require('../../../models/utils/Encryption');

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

  test('Expect create success a email', async () => {
    const createRessult = await create(mailData.mail, mailData.code, mailData.did);
    const decriptResult = await Encrypt.decript(createRessult.email.encrypted);
    expect(createRessult.did).toBe(undefined);
    expect(Object.prototype.toString.call(createRessult.code.hash) === '[object String]')
      .toBeTruthy();
    expect(Object.prototype.toString.call(createRessult.code.salt) === '[object String]')
      .toBeTruthy();
    expect(decriptResult).toMatch(mailData.mail);
  });
});
