const { verifyCertificatePhoneNumber, createPhoneCertificate } = require('../../../services/CertService');
const { missingJwt } = require('../../../constants/serviceErrors');
const { data } = require('./constant');

describe('services/Cert/verifyCertificatePhoneNumber.test.js', () => {
  let cert;
  beforeAll(async () => {
    cert = await createPhoneCertificate(data.did, data.phoneNumber);
  });

  test('Expect verifyCertificatePhoneNumber to throw error on missing jwt', async () => {
    try {
      await verifyCertificatePhoneNumber(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect verifyCertificatePhoneNumber to success', async () => {
    const response = await verifyCertificatePhoneNumber(cert);
    expect(response).not.toBe(null);
  });
});
