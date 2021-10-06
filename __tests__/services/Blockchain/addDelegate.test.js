/* eslint-disable import/no-extraneous-dependencies */
const { Credentials } = require('uport-credentials');
const { getDidAddress } = require('../../../services/BlockchainService');
const { missingIssuerDid } = require('../../../constants/serviceErrors');
const { addDelegate, validDelegate } = require('../../../services/BlockchainService');
const Constants = require('../../../constants/Constants');

describe('services/Blockchain/addDelegate.test.js', () => {
  const rsk = Credentials.createIdentity();
  rsk.did = `did:ethr:rsk:${getDidAddress(rsk.did)}`;
  const lacchain = Credentials.createIdentity();
  lacchain.did = `did:ethr:lacchain:${getDidAddress(lacchain.did)}`;
  const bfa = Credentials.createIdentity();
  bfa.did = `did:ethr:bfa:${getDidAddress(bfa.did)}`;
  const main = Credentials.createIdentity();

  test('Expect addDelegate to throw on missing issuerDID', async () => {
    try {
      await addDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });

  // Did without network
  test('Expect addDelegate to add Delegate on any blockchain', async () => {
    const result = await addDelegate(main.did);
    expect(result.some((response) => response.status === 'fulfilled'));
  });

  // RSK
  test('Expect addDelegate to add Delegate RSK', async () => {
    const result = await addDelegate(rsk.did);
    const confirmation = await validDelegate(rsk.did);
    expect(result.transactionHash).not.toBe(null);
    expect(result.from).toBe(Constants.SERVER_DID);
    expect(confirmation).toBeTruthy();
  });

  // Lacchain
  test('Expect addDelegate to add Delegate LACCH', async () => {
    const result = await addDelegate(lacchain.did);
    const confirmation = await validDelegate(lacchain.did);
    expect(result.transactionHash).not.toBe(null);
    expect(result.from).toBe(Constants.SERVER_DID);
    expect(confirmation).toBeTruthy();
  });

  // BFA SKIPED DUE TO LACK OF GAS
  test.skip('Expect addDelegate to add Delegate BFA', async () => {
    const result = await addDelegate(bfa.did);
    const confirmation = await validDelegate(bfa.did);
    expect(result.transactionHash).not.toBe(null);
    expect(result.from).toBe(Constants.SERVER_DID);
    expect(confirmation).toBeTruthy();
  });

  test('Expect addDelegate to throw an error whit bad did', async () => {
    try {
      await addDelegate('0x123');
    } catch (e) {
      expect(e.code).toMatch('INVALID_ARGUMENT');
    }
  });
});
