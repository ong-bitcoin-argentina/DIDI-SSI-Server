const { createMailCertificate, decodeCertificate } = require('../../../services/CertService');
const { missingEmail, missingDid } = require('../../../constants/serviceErrors');
const { data } = require('./constant');

describe('services/Cert/createMailCertificate.test.js', () => {
  test('Expect createMailCertificate to throw on missing did', async () => {
    try {
      await createMailCertificate(undefined, 'email');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createMailCertificate to throw on missing email', async () => {
    try {
      await createMailCertificate('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect createMailCertificate to create a Mail Certificate', async () => {
    const result = await createMailCertificate(data.did, data.mail);
    const { payload } = await decodeCertificate(result, 'err');
    expect(payload.sub).toBe(data.did);
  });
});
