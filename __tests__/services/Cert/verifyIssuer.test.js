const { verifyIssuer } = require('../../../services/CertService');
const { missingIssuerDid } = require('../../../constants/serviceErrors');
const { data } = require('./constant');
const Messages = require('../../../constants/Messages');
const Constants = require('../../../constants/Constants');

describe('services/Cert/verifyIssuer.test.js', () => {
  test('Expect verifyIssuer to throw on missing issuerDid', async () => {
    try {
      await verifyIssuer(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });

  test('Expect verifyIssuer to success', async () => {
    const response = await verifyIssuer(data.issuerDid);
    expect(response).toMatch(Messages.CERTIFICATE.VERIFIED);
  });

  test('Expect verifyIssuer to throw error on invalid issuer', async () => {
    try {
      await verifyIssuer(data.did);
    } catch (e) {
      expect(e.code).toMatch(Messages.ISSUER.ERR.IS_INVALID.code);
    }
  });

  test('Expect verifyIssuer to success with DIDI Server DID ', async () => {
    const response = await verifyIssuer(`did:ethr:${Constants.SERVER_DID}`);
    expect(response).toMatch(Messages.CERTIFICATE.VERIFIED);
  });
});
