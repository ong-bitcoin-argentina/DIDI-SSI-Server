const { saveCertificate } = require('../../../services/MouroService');
const { missingDid, missingCert } = require('../../../constants/serviceErrors');

describe('services/Mouro/saveCertificate.test.js', () => {
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
});
