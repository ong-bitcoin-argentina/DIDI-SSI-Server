const { decodeCertificate, createCertificate } = require('../../../services/CertService');
const { missingJwt, missingErrMsg } = require('../../../constants/serviceErrors');
const { data } = require('./constant');
const Messages = require('../../../constants/Messages');

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

  test('Expect decodeCertificate to success', async () => {
    const cert = await createCertificate(
      data.did,
      data.did,
      '123456',
      Messages.CERTIFICATE.ERR.CREATE,
    );
    const { payload } = await decodeCertificate(cert, Messages.ISSUER.ERR.CERT_IS_INVALID);
    expect(payload.sub).toBe(data.did);
  });

  test('Expect decodeCertificate to throw on invalid certificate', async () => {
    try {
      await decodeCertificate('jwt', Messages.ISSUER.ERR.CERT_IS_INVALID);
    } catch (e) {
      expect(e.code).toMatch(Messages.ISSUER.ERR.CERT_IS_INVALID.code);
      expect(e.message).toMatch(Messages.ISSUER.ERR.CERT_IS_INVALID.message);
    }
  });
});
