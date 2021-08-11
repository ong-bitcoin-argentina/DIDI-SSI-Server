/* eslint-disable import/no-extraneous-dependencies */
const { Credentials } = require('uport-credentials');
const { missingIssuerDid } = require('../../../constants/serviceErrors');
const { addDelegate } = require('../../../services/BlockchainService');

xdescribe('services/Blockchain/addDelegate.test.js', () => {
  const rsk = Credentials.createIdentity();
  rsk.did = `did:ethr:rsk:${rsk.did}`;
  const lacchain = Credentials.createIdentity();
  lacchain.did = `did:ethr:lacchain:${lacchain.did}`;
  const bfa = Credentials.createIdentity();
  bfa.did = `did:ethr:bfa:${bfa.did}`;
  test('Expect addDelegate to throw on missing issuerDID', async () => {
    try {
      await addDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });

  // RSK
  test('Expect addDelegate to add Delegate RSK', async () => {
    const result = await addDelegate(rsk.did);
    expect(result.events.DIDDelegateChanged).toBeTruthy();
  });

  // Lacchain
  test('Expect addDelegate to add Delegate LACCH', async () => {
    const result = await addDelegate(lacchain.did);
    expect(result.events.DIDDelegateChanged).toBeTruthy();
  });

  // BFA
  test.skip('Expect addDelegate to add Delegate BFA', async () => {
    const result = await addDelegate(bfa.did);
    expect(result.events.DIDDelegateChanged).toBeTruthy();
  });

  test('Expect addDelegate to throw an error whit bad did', async () => {
    try {
      await addDelegate('0x123');
    } catch (e) {
      expect(e.code).toMatch('INVALID_ARGUMENT');
    }
  });
});
