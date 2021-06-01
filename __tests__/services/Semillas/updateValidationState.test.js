jest.mock('node-fetch');
const mongoose = require('mongoose');
const { updateValidationState } = require('../../../services/SemillasService');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingDid, missingState } = require('../../../constants/serviceErrors');

/**
*  Actualización del estado de la solicitud de validación de identidad
*/
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
   * Test de error con did vacio.
   */
  test('Expect updateValidationState to throw on missing did', async () => {
    try {
      await updateValidationState(undefined, 'state');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * Test de error con state vacio.
   */
  test('Expect updateValidationState to throw on missing state', async () => {
    try {
      await updateValidationState('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingState.code);
    }
  });
});
