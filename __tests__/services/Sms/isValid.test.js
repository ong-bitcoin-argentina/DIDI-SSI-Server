const mongoose = require('mongoose');
const { isValid, create } = require('../../../services/SmsService');
const {
  missingPhoneNumber, missingCode,
} = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
const { userData, errorValid } = require('./constans');

describe('Should be green', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await create(userData.validPhoneNumber, userData.code, userData.did);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('phones');
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
    const result = await isValid(userData.validPhoneNumber, userData.code);
    expect(result).not.toBeNull();
  });

  test('Expect isValid to throw Error', async () => {
    try {
      await isValid(userData.validPhoneNumber, userData.invalidPhoneNumber);
    } catch (e) {
      expect(e.code).toMatch(errorValid.code);
    }
  });
});
