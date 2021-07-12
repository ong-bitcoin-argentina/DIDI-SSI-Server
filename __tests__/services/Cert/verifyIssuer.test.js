/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { verifyIssuer } = require('../../../services/CertService');
const { missingIssuerDid } = require('../../../constants/serviceErrors');

describe('services/Cert/verifyIssuer.test.js', () => {
  test('Expect verifyIssuer to throw on missing issuerDid', async () => {
    try {
      await verifyIssuer(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });
});
