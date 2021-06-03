jest.mock('node-fetch');
const mongoose = require('mongoose');
const { updateValidationState } = require('../../../services/SemillasService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingDid, missingState } = require('../../../constants/serviceErrors');

describe('services/Semillas/updateValidationState.test.js', () => {
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

  test('Expect updateValidationState to throw on missing did', async () => {
    try {
      await updateValidationState(undefined, 'state');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect updateValidationState to throw on missing state', async () => {
    try {
      await updateValidationState('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingState.code);
    }
  });
});
