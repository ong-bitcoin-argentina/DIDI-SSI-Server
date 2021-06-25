jest.mock('node-fetch');
const mongoose = require('mongoose');
const { shareData } = require('../../../services/SemillasService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingData } = require('../../../constants/serviceErrors');

describe('services/Semillas/shareData.test.js', () => {
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

  test('Expect shareData to throw on missing data', async () => {
    try {
      await shareData(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });
});
