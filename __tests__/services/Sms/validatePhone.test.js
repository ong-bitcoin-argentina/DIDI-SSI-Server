const mongoose = require('mongoose');
const { validatePhone, create, isValid } = require('../../../services/SmsService');
const {
  missingPhoneNumber, missingDid,
} = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
const { userData } = require('./constans');

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

  test('Expect validatePhone to throw on missing phone', async () => {
    try {
      await validatePhone(undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect validatePhone to throw on missing did', async () => {
    try {
      await validatePhone('phone', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect validatePhone to validatePhone', async () => {
    const phone = await isValid(userData.validPhoneNumber, userData.code);
    const result = await validatePhone(phone, userData.did);
    expect(result.validated).toBe(true);
    expect(result.did).toBe(userData.did);
  });
});
