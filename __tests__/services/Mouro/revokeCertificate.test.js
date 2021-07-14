const { revokeCertificate, saveCertificate } = require('../../../services/MouroService');
const { missingHash, missingDid, missingJwt } = require('../../../constants/serviceErrors');
const { data, cert } = require('./constants');

describe('services/Mouro/revokeCertificate.test.js', () => {
  let response;
  beforeAll(async () => {
    response = await saveCertificate(await cert, data.did);
  });
  test('Expect revokeCertificate to throw on missing jwt', async () => {
    try {
      await revokeCertificate(undefined, 'hash', 'did');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect revokeCertificate to throw on missing hash', async () => {
    try {
      await revokeCertificate('jwt', undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingHash.code);
    }
  });

  test('Expect revokeCertificate to throw on missing did', async () => {
    try {
      await revokeCertificate('jwt', 'hash', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
  test('Expect revokeCertificate to success', async () => {
    const result = await revokeCertificate(response.data, response.hash, data.did);
    expect(result.data.removeEdge).toMatch(response.hash);
  });
});
