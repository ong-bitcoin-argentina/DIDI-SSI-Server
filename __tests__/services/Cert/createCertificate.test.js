const { createCertificate, decodeCertificate } = require('../../../services/CertService');
const { missingDid, missingSubject, missingErrMsg } = require('../../../constants/serviceErrors');
const { data } = require('./constant');
const Messages = require('../../../constants/Messages');

describe('services/Cert/createCertificate.test.js', () => {
  test('Expect createCertificate to throw on missing did', async () => {
    try {
      await createCertificate(undefined, 'subject', 'expDate', 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createCertificate to throw on missing subject', async () => {
    try {
      await createCertificate('did', undefined, 'expDate', 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingSubject.code);
    }
  });

  test('Expect createCertificate to throw on missing errMsg', async () => {
    try {
      await createCertificate('did', 'subject', 'expDate', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingErrMsg.code);
    }
  });

  test('Expect createCertificate to success', async () => {
    const expDate = Date.now();
    const result = await createCertificate(
      data.did,
      data.did,
      expDate,
      Messages.CERTIFICATE.ERR.CREATE,
    );
    const { payload } = await decodeCertificate(result, 'err');
    expect(payload.sub).toBe(data.did);
  });

  test('Expect createCertificate to success with undefined expDate', async () => {
    const result = await createCertificate(
      data.did,
      data.did,
      undefined,
      Messages.CERTIFICATE.ERR.CREATE,
    );
    const { payload } = await decodeCertificate(result, 'err');
    expect(payload.sub).toBe(data.did);
  });

  test('Expect createCertificate to create certificate with "exp": "0"', async () => {
    const expDate = 1;
    const result = await createCertificate(
      data.did,
      data.did,
      expDate,
      Messages.CERTIFICATE.ERR.CREATE,
    );
    const { payload } = await decodeCertificate(result, 'err');
    expect(payload.exp).toBe(0);
  });
});
