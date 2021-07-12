/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { verifyCertificateEmail } = require('../../../services/CertService');
const { missingJwt } = require('../../../constants/serviceErrors');

describe('services/Cert/verifyCertificateEmail.test.js', () => {
  test('Expect verifyCertificateEmail to throw on missing jwt', async () => {
    try {
      await verifyCertificateEmail(undefined, 'hash');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
});
