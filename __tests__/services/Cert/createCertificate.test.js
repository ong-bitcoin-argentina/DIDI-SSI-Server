/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { createCertificate, decodeCertificate } = require('../../../services/CertService');
const { missingDid, missingSubject, missingErrMsg } = require('../../../constants/serviceErrors');

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

  test('Expect createCertificate to createCertificate', async () => {
    const result = await createCertificate('did:ethr:0x123', 'algo', undefined, 'errMsg');
    const decodificado = await decodeCertificate(result, 'err');
    expect(decodificado.payload.sub).toBe('did:ethr:0x123');
  });
});
