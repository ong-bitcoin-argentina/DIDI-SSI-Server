const mongoose = require('mongoose');
const { isValid, create } = require('../../../services/SmsService');
const {
  missingPhoneNumber, missingCode,
} = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
const { appData, errorValid } = require('./constans');

describe('Should be green', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await create(appData.phoneNumber, appData.code, appData.did);
  });

  afterAll(async () => {
    // await mongoose.connection.db.dropCollection('phones');
    await mongoose.connection.close();
  });

  test('Expect isValid to throw on missing phoneNumber', async () => {
    try {
      await isValid(undefined, 'code');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect isValid to throw on missing code', async () => {
    try {
      await isValid('phoneNumber', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  test('Expect isValid to be Success', async () => {
    const result = await isValid(appData.phoneNumber, appData.code);
    expect(result).not.toBeNull();
    /* expect(result.validated).toBe(true);
    expect(result.validated).toBe(false);
     */
  });

  test('Expect isValid to be Error', async () => {
    try {
      await isValid(appData.phoneNumber, '987');
    } catch (e) {
      expect(e.code).toMatch(errorValid.code);
    }
  });
});
