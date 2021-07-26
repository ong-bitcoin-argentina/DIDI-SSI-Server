const { verifyCertificate, createCertificate } = require('../../../services/CertService');
const { missingJwt, missingErrMsg } = require('../../../constants/serviceErrors');
const { data } = require('./constant');
const Messages = require('../../../constants/Messages');

describe('services/Cert/verifyCertificate.test.js', () => {
  let cert;
  beforeAll(async () => {
    cert = await createCertificate(
      data.did,
      data.did,
      undefined,
      Messages.CERTIFICATE.ERR.CREATE,
    );
  });

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

  test('Expect verifyCertificate to success', async () => {
    const response = await verifyCertificate(cert, undefined, Messages.ISSUER.ERR.IS_INVALID);
    expect(response).not.toBe(null);
  });

  test('Expect verifyCertificate to throw on invalid certificate', async () => {
    const response = await verifyCertificate(data.jwt, 'hash', Messages.ISSUER.ERR.IS_INVALID);
    expect(response).not.toBe(null);
  });
});
