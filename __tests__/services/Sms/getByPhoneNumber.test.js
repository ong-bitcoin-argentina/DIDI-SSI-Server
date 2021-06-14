const mongoose = require('mongoose');
const { getByPhoneNumber, create } = require('../../../services/SmsService');
const { missingPhoneNumber } = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
const { appData, error } = require('./constans');

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

  test('Expect getByPhoneNumber to throw on missing phoneNumber', async () => {
    try {
      await getByPhoneNumber(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect getByPhoneNumber to be Successful ', async () => {
    const result = await getByPhoneNumber(appData.phoneNumber);
    expect(result).not.toBeNull();
  });

  test('Expect getByPhoneNumber to throw Error ', async () => {
    try {
      await getByPhoneNumber(appData.otherPhoneNumber);
    } catch (e) {
      expect(e.code).toMatch(error.code);
    }
  });
});
