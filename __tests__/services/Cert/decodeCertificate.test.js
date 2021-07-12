/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { decodeCertificate } = require('../../../services/CertService');
const { missingJwt, missingErrMsg } = require('../../../constants/serviceErrors');

describe('services/Cert/decodeCertificate.test.js', () => {
  test('Expect decodeCertificate to throw on missing jwt', async () => {
    try {
      await decodeCertificate(undefined, 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect decodeCertificate to throw on missing errMsg', async () => {
    try {
      await decodeCertificate('jwt', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingErrMsg.code);
    }
  });
});
