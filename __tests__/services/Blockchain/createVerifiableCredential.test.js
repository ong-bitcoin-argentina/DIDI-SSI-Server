const { Credentials } = require('uport-credentials');
const BlockchainService = require('../../../services/BlockchainService');
const {
  missingIssuerDid, missingDid, missingPayload, missingPrivateKey,
} = require('../../../constants/serviceErrors');
const { SERVER_DID, SERVER_PRIVATE_KEY } = require('../../../constants/Constants');

const serverDid = `did:ethr:${SERVER_DID}`;
const privateKey = SERVER_PRIVATE_KEY;

describe('services/Blockchain/createVerifiableCredential.test.js', () => {
  const subject = Credentials.createIdentity();
  test('Expect createVerifiableCredential to throw on missing subjectDid', async () => {
    try {
      await BlockchainService.createVerifiableCredential(undefined, 'subjectPayload', 'expDate', 'issuerDid', 'issuerPkey');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createVerifiableCredential to throw on missing subjectPayload', async () => {
    try {
      await BlockchainService.createVerifiableCredential('subjectDid', undefined, 'expDate', 'issuerDid', 'issuerPkey');
    } catch (e) {
      expect(e.code).toMatch(missingPayload.code);
    }
  });

  test('Expect createVerifiableCredential to throw on missing issuerDid', async () => {
    try {
      await BlockchainService.createVerifiableCredential('subjectDid', 'subjectPayload', 'expDate', undefined, 'issuerPkey');
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });

  test('Expect createVerifiableCredential to throw on missing issuerPkey', async () => {
    try {
      await BlockchainService.createVerifiableCredential('subjectDid', 'subjectPayload', 'expDate', 'issuerDid', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPrivateKey.code);
    }
  });

  test('Expect createVerifiableCredential success', async () => {
    const expDate = Date.now() / 1000 + 500;
    const credential = await BlockchainService.createVerifiableCredential(
      subject.did,
      { subjectInfo: 'test' },
      expDate,
      serverDid,
      privateKey,
    );
    const { payload } = await BlockchainService.decodeJWT(credential);
    expect(payload.iss).toBe(serverDid);
    expect(payload.sub).toBe(subject.did);
    const now = Date.now() / 1000;
    expect(payload.iat - now).toBeLessThan(500);
  });
});
