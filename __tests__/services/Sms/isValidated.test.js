const mongoose = require('mongoose');
const { isValidated, create } = require('../../../services/SmsService');
const {
  missingPhoneNumber, missingDid,
} = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
const { appData } = require('./constans');

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
    await mongoose.connection.db.dropCollection('phones');
    await mongoose.connection.close();
  });

  test('Expect isValidated to throw on missing did', async () => {
    try {
      await isValidated(undefined, 'phone');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect isValidated to throw on missing phone', async () => {
    try {
      await isValidated('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect isValidated to throw false', async () => {
    const result = await isValidated(appData.did, appData.phoneNumber);
    expect(result).toBe(false);
  });
});
