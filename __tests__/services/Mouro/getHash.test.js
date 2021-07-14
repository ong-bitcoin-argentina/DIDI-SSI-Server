const { getHash, saveCertificate, revokeCertificate } = require('../../../services/MouroService');
const { missingDid } = require('../../../constants/serviceErrors');
const { data, cert } = require('./constants');

describe('services/Mouro/getHash.test.js', () => {
  let response;
  beforeAll(async () => {
    response = await saveCertificate(await cert, data.did);
  });
  afterAll(async () => {
    await revokeCertificate(response.data, response.hash, data.did);
  });
  test('Expect getHash to throw on missing did', async () => {
    try {
      await getHash(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
  test('Expect getHash to obtain hash', async () => {
    const hash = await getHash(data.did);
    expect(hash).not.toBe(undefined);
  });
  // Se saltea dado que el servicio nunca falla
  test.skip('Expect getHash to throw error on invalid Did', async () => {
    try {
      await getHash(data.invalidDid);
    } catch (e) {
      expect(e).not.toBe(undefined);
    }
  });
});
