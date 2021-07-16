const mongoose = require('mongoose');
const { create } = require('../../../services/SmsService');
const {
  missingPhoneNumber, missingCode,
} = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
const { userData } = require('./constanst');

describe('services/Sms/create.test.js', () => {
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
    await mongoose.connection.db.dropCollection('phones');
    await mongoose.connection.close();
  });

  test('Expect create to throw on missing phoneNumber', async () => {
    try {
      await create(undefined, 'code', 'did');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect create to throw on missing code', async () => {
    try {
      await create('phoneNumber', undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  test('Expect create to create', async () => {
    const result = await create(userData.validPhoneNumber, userData.code, userData.did);
    expect(result).not.toBeNull();
  });
});
