const { createPetition, decodeCertificate } = require('../../../services/CertService');
const { missingClaims, missingCallback, missingDid } = require('../../../constants/serviceErrors');
const { data } = require('./constant');

describe('services/Cert/createPetition.test.js', () => {
  test('Expect createPetition to throw on missing did', async () => {
    try {
      await createPetition(undefined, 'claims', 'callback');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createPetition to throw on missing claims', async () => {
    try {
      await createPetition('did', undefined, 'callback');
    } catch (e) {
      expect(e.code).toMatch(missingClaims.code);
    }
  });

  test('Expect createPetition to throw on missing callback', async () => {
    try {
      await createPetition('did', 'claims', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCallback.code);
    }
  });

  test('Expect createPetition to success', async () => {
    const { did, claims, callback } = data;
    const response = await createPetition(did, claims, callback);
    const { payload } = await decodeCertificate(response, 'err');
    expect(payload.sub).toBe(data.did);
  });
});
