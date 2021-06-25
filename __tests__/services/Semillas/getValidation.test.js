jest.mock('node-fetch');
const mongoose = require('mongoose');
const { getValidation } = require('../../../services/SemillasService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingDid } = require('../../../constants/serviceErrors');

describe('services/Semillas/getValidation.test.js', () => {
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

  test('Expect getValidation to throw on missing did', async () => {
    try {
      await getValidation(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
});
