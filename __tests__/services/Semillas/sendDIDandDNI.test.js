const { Response } = jest.requireActual('node-fetch');
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { sendDIDandDNI } = require('../../../services/SemillasService');
const { missingDid, missingDni } = require('../../../constants/serviceErrors');

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
   * Solicita las credenciales a semillas con dni vacio.
   * Se espera un error.
   */
  test('Expect sendDIDandDNI to throw on missing dni', async () => {
    try {
      await sendDIDandDNI({ dni: undefined, did: 'did' });
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });

  /**
   * Solicita las credenciales a semillas con did vacio.
   * Se espera un error.
   */
  test('Expect sendDIDandDNI to throw on missing did', async () => {
    try {
      await sendDIDandDNI({ dni: 'dni', did: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * Solicita las credenciales a semillas.
   * Caso de exito.
   */
  test('Expect success response', async () => {
    const app = await sendDIDandDNI({ dni: 35986491, did: 'did:ethr:0xc54e8f526c2880ef454ee9552ee5f60a89f1820e' });
    await console.log("app!!!", app);
    await expect(app).toMatchObject({ message: 'El usuario con Dni: 35986491 ya posee sus credenciales validadas o en espera con Didi, no se realizó ninguna operación' });
  });
});
