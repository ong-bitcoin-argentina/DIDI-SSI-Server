const { saveCertificate, revokeCertificate } = require('../../../services/MouroService');
const { missingDid, missingCert } = require('../../../constants/serviceErrors');
const { cert, data } = require('./constants');

describe('services/Mouro/saveCertificate.test.js', () => {
  let response;
  afterAll(async () => {
    await revokeCertificate(response.data, response.hash, data.did);
  });
  test('Expect saveCertificate to throw on missing cert', async () => {
    try {
      await saveCertificate(undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingCert.code);
    }
  });

  test('Expect saveCertificate to throw on missing did', async () => {
    try {
      await saveCertificate('cert', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect saveCertificate to success', async () => {
    response = await saveCertificate(await cert, data.did);
    expect(response.data).toMatch(await cert);
    expect(response.hash).not.toBe(undefined);
  });
});
