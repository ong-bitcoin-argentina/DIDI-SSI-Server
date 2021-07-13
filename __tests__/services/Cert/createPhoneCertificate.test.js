/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { createPhoneCertificate, decodeCertificate } = require('../../../services/CertService');
const { missingPhoneNumber, missingDid } = require('../../../constants/serviceErrors');

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
    const result = await createPhoneCertificate('did:ethr:0x123', '123');
    const decodificado = await decodeCertificate(result, 'err');
    expect(decodificado.payload.sub).toBe('did:ethr:0x123');
  });
});
