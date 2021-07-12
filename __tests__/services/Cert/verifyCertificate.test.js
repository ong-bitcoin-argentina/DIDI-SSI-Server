/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { verifyCertificate } = require('../../../services/CertService');
const { missingJwt, missingErrMsg } = require('../../../constants/serviceErrors');

describe('services/Cert/verifyCertificate.test.js', () => {
  test('Expect verifyCertificate to throw on missing jwt', async () => {
    try {
      await verifyCertificate(undefined, 'hash', 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect verifyCertificate to throw on missing errMsg', async () => {
    try {
      await verifyCertificate('jwt', 'hash', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingErrMsg.code);
    }
  });
});
