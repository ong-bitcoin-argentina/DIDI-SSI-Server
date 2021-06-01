jest.mock('node-fetch');
const mongoose = require('mongoose');
const { shareData } = require('../../../services/SemillasService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingData } = require('../../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * BeforeAll
   */
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
  });

  /**
   * AfterAll
   */
  afterAll(async () => {
    await mongoose.connection.close();
  });

  /**
 *  Usuario comparte sus credenciales al prestador para solicitar su servicio
 */
  test('Expect shareData to throw on missing data', async () => {
    try {
      await shareData(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });
});
