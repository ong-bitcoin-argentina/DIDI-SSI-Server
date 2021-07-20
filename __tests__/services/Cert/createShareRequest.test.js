const { createShareRequest, decodeCertificate } = require('../../../services/CertService');
const { missingDid, missingJwt } = require('../../../constants/serviceErrors');
const { data } = require('./constant');

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

  test('Expect createShareRequest to successs', async () => {
    const response = await createShareRequest(data.did, data.jwt);
    const { payload } = await decodeCertificate(response, 'err');
    expect(payload.sub).toBe(data.did);
  });
});
