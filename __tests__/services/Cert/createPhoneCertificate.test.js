const { createPhoneCertificate, decodeCertificate } = require('../../../services/CertService');
const { missingPhoneNumber, missingDid } = require('../../../constants/serviceErrors');
const { data } = require('./constant');

describe('services/Cert/createPhoneCertificate.test.js', () => {
  test('Expect createPhoneCertificate to throw on missing did', async () => {
    try {
      await createPhoneCertificate(undefined, 'phoneNumber');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createPhoneCertificate to throw on missing phoneNumber', async () => {
    try {
      await createPhoneCertificate('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect createPhoneCertificate to throw on missing phoneNumber', async () => {
    const response = await createPhoneCertificate(data.did, data.phoneNumber);
    const { payload } = await decodeCertificate(response, 'err');
    expect(payload.sub).toBe(data.did);
  });
});
