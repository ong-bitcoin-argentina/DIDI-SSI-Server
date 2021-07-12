const { revokeCertificate } = require('../../../services/MouroService');
const { missingHash, missingDid, missingJwt } = require('../../../constants/serviceErrors');

describe('services/Mouro/revokeCertificate.test.js', () => {
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
});
