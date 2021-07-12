/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { createShareRequest } = require('../../../services/CertService');
const { missingDid, missingJwt } = require('../../../constants/serviceErrors');

describe('services/Cert/createShareRequest.test.js', () => {
  test('Expect createShareRequest to throw on missing did', async () => {
    try {
      await createShareRequest(undefined, 'jwt');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createShareRequest to throw on missing jwt', async () => {
    try {
      await createShareRequest('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
});
