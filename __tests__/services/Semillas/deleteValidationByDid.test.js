jest.mock('node-fetch');
const mongoose = require('mongoose');
const { deleteValidationByDid } = require('../../../services/SemillasService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingDid } = require('../../../constants/serviceErrors');

describe('services/Semillas/deleteValidationByDid.test.js', () => {
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

  test('Expect deleteValidationByDid to throw on missing did', async () => {
    try {
      await deleteValidationByDid(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
});
