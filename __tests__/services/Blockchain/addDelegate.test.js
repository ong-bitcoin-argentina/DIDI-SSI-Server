/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const { addDelegate } = require('../../../services/BlockchainService');
const { missingIssuerDid } = require('../../../constants/serviceErrors');
const { data } = require('./constant');

describe('services/Blockchain/addDelegate.test.js', () => {
  test('Expect addDelegate to throw on missing issuerDID', async () => {
    try {
      await addDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });

  // RSK
  test('Expect addDelegate to add Delegate RSK', async () => {
    const result = await addDelegate(data.issuerDIDRsk);
    expect(result.events.DIDDelegateChanged).toBeTruthy();
  });

  // Lacchain
  test('Expect addDelegate to add Delegate LACCH', async () => {
    const result = await addDelegate(data.issuerDIDLacch);
    expect(result.events.DIDDelegateChanged).toBeTruthy();
  });

  // BFA
  test.skip('Expect addDelegate to add Delegate BFA', async () => {
    const result = await addDelegate(data.issuerDIDBfa);
    expect(result.events.DIDDelegateChanged).toBeTruthy();
  });

  test('Expect addDelegate to throw an error whit bad did', async () => {
    try {
      await addDelegate(data.invalidIssuerDID);
    } catch (e) {
      expect(e.code).toMatch('INVALID_ARGUMENT');
    }
  });
});
