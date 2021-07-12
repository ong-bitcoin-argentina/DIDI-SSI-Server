/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { verifyCertificatePhoneNumber } = require('../../../services/CertService');
const { missingJwt } = require('../../../constants/serviceErrors');

describe('services/Cert/verifyCertificatePhoneNumber.test.js', () => {
  test('Expect verifyCertificatePhoneNumber to throw on missing jwt', async () => {
    try {
      await verifyCertificatePhoneNumber(undefined, 'hash');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
});
