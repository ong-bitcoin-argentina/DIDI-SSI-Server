/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { createMailCertificate } = require('../../../services/CertService');
const { missingEmail, missingDid } = require('../../../constants/serviceErrors');

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
});
