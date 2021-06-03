jest.mock('node-fetch');
const mongoose = require('mongoose');
const { validateDni } = require('../../../services/SemillasService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingDni } = require('../../../constants/serviceErrors');

describe('services/Semillas/validateDni.test.js', () => {
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

  test('Expect validateDni to throw on missing dni', async () => {
    try {
      await validateDni(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });
});
