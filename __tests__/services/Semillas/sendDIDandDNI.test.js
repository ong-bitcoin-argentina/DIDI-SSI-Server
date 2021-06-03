const mongoose = require('mongoose');
const fetch = require('node-fetch');
const { MONGO_URL } = require('../../../constants/Constants');
const { sendDIDandDNI } = require('../../../services/SemillasService');
const { missingDid, missingDni } = require('../../../constants/serviceErrors');
const { messages, appData } = require('./constants');

jest.mock('../../../models/SemillasAuth', () => ({
  getToken: () => ({ token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYyMjIzMDcyMCwiZXhwIjoxNjIyODM1NTIwfQ.XIR5oQgglbnUY9nkvhOwuFCD0XUNoIdP3v1cAnvj4qwwjxg7j53_byF3MVFwUPCmM-QlR0ZVQBoB2SUwsFPdhA' }),
  createOrUpdateToken: () => ({ token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYyMjIzMDcyMCwiZXhwIjoxNjIyODM1NTIwfQ.XIR5oQgglbnUY9nkvhOwuFCD0XUNoIdP3v1cAnvj4qwwjxg7j53_byF3MVFwUPCmM-QlR0ZVQBoB2SUwsFPdhA' }),
}));
jest.mock('node-fetch');

describe('services/Semillas/sendDIDandDNI.test.js', () => {
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

  test('Expect sendDIDandDNI to throw on missing dni', async () => {
    try {
      await sendDIDandDNI({ dni: undefined, did: 'did' });
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });

  test('Expect sendDIDandDNI to throw on missing did', async () => {
    try {
      await sendDIDandDNI({ dni: 'dni', did: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect no operation response', async () => {
    fetch.mockReturnValue(
      Promise.resolve(
        { json: () => (messages.sendDIDandDNINoOperation) },
      ),
    );
    const app = await sendDIDandDNI({ dni: appData.dni, did: appData.did });
    await expect(app).toMatchObject(messages.sendDIDandDNINoOperation);
  });

  test('Expect success response', async () => {
    fetch.mockReturnValue(
      Promise.resolve(
        { json: () => (messages.sendDIDandDNIOk) },
      ),
    );
    const app = await sendDIDandDNI({ dni: appData.dni, did: appData.did });
    await expect(app).toMatchObject(messages.sendDIDandDNIOk);
  });
});
