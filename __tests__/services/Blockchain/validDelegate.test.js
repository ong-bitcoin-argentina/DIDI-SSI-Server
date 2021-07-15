/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { validDelegate, addDelegate } = require('../../../services/BlockchainService');
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
  test('Expect validDelegate to be true on RSK', async () => {
    await addDelegate(data.issuerDIDRsk);
    const result = await validDelegate(data.issuerDIDRsk);
    expect(result).toBe(true);
  });

  // Lacchain
  test('Expect validDelegate to be true on Lacch', async () => {
    await addDelegate(data.issuerDIDLacch);
    const result = await validDelegate(data.issuerDIDLacch);
    expect(result).toBe(true);
  });

  // BFA
  test.skip('Expect validDelegate to be true on BFA', async () => {
    const result = await validDelegate(data.issuerDIDBfa);
    expect(result).toBe(true);
  });
});
