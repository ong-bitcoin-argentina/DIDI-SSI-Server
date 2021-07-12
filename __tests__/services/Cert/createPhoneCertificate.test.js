/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { createPhoneCertificate } = require('../../../services/CertService');
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
});
