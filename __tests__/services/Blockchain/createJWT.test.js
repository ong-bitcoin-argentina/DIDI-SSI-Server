const BlockchainService = require('../../../services/BlockchainService');
const {
  missingIssuerDid, missingPayload, missingPrivateKey,
} = require('../../../constants/serviceErrors');
const { SERVER_DID, SERVER_PRIVATE_KEY } = require('../../../constants/Constants');

const serverDid = `did:ethr:${SERVER_DID}`;
const privateKey = SERVER_PRIVATE_KEY;

describe('services/Blockchain/createVerifiableCredential.test.js', () => {
  test('Expect createJWT to throw on missing issuerDid', async () => {
    try {
      await BlockchainService.createJWT(undefined, 'privateKey', 'payload', 'expiration', 'audienceDID');
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });

  test('Expect createJWT to throw on missing privateKey', async () => {
    try {
      await BlockchainService.createJWT('issuerDid', undefined, 'payload', 'expiration', 'audienceDID');
    } catch (e) {
      expect(e.code).toMatch(missingPrivateKey.code);
    }
  });

  test('Expect createJWT to throw on missing issuerDid', async () => {
    try {
      await BlockchainService.createJWT('issuerDid', 'privateKey', undefined, 'expiration', 'audienceDID');
    } catch (e) {
      expect(e.code).toMatch(missingPayload.code);
    }
  });

  test('Expect createJWT success', async () => {
    const expDate = Date.now() / 1000 + 500;
    const jwt = await BlockchainService.createJWT(
      serverDid,
      privateKey,
      { info: 'test' },
      expDate,
    );
    const { payload } = await BlockchainService.decodeJWT(jwt);
    expect(payload.iss).toBe(serverDid);
    const now = Date.now() / 1000;
    expect(payload.iat - now).toBeLessThan(500);
  });
});
