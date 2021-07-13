/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { createMailCertificate, decodeCertificate } = require('../../../services/CertService');
const { missingEmail, missingDid } = require('../../../constants/serviceErrors');

describe('services/Cert/createMailCertificate.test.js', () => {
  test('Expect createMailCertificate to throw on missing did', async () => {
    try {
      await createMailCertificate(undefined, 'email');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createMailCertificate to throw on missing email', async () => {
    try {
      await createMailCertificate('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect createMailCertificate to create a Mail Certificate', async () => {
    const result = await createMailCertificate('did:ethr:0x123', 'mail@mail.com');
    const decodificado = await decodeCertificate(result, 'err');
    expect(decodificado.payload.sub).toBe('did:ethr:0x123');
  });
});
