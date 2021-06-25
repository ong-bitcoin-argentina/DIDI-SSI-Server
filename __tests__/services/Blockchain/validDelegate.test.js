require('fast-text-encoding');

const { validDelegate } = require('../../../services/BlockchainService');
const { missingIssuerDid } = require('../../../constants/serviceErrors');

const { data } = require('./constant');

describe('services/Blockchain/validDelegate.test.js', () => {
  test('Expect validDelegate to throw on missing issuerDID', async () => {
    try {
      await validDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });

  // RSK
  test('Expect validDelegate to validDelegate RSK', async () => {
    const result = await validDelegate(data.issuerDIDRsk);
    expect(result).toBe(true);
  });

  // Lacchain
  test('Expect validDelegate to validDelegate Latch', async () => {
    const result = await validDelegate(data.issuerDIDLatch);
    expect(result).toBe(true);
  });

  // BFA
  test.skip('Expect validDelegate to validDelegate BFA', async () => {
    const result = await validDelegate(data.issuerDIDBfa);
    expect(result).toBe(true);
  });
});
