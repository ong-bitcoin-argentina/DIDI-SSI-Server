const { verifyCertificateEmail, createMailCertificate } = require('../../../services/CertService');
const { missingJwt } = require('../../../constants/serviceErrors');
const { data } = require('./constant');

describe('services/Cert/verifyCertificateEmail.test.js', () => {
  let cert;
  beforeAll(async () => {
    cert = await createMailCertificate(data.did, data.mail);
  });

  test('Expect verifyCertificateEmail to throw on missing jwt', async () => {
    try {
      await verifyCertificateEmail(undefined, 'hash');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect verifyCertificateEmail to success', async () => {
    const response = await verifyCertificateEmail(cert);
    expect(response).not.toBe(null);
  });
});
