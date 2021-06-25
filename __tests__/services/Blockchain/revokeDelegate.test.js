require('fast-text-encoding');

const { revokeDelegate, addDelegate } = require('../../../services/BlockchainService');
const { missingOtherDID } = require('../../../constants/serviceErrors');

const { data } = require('./constant');

describe('services/Blockchain/revokeDelegate.test.js', () => {
/*   beforeAll(async () => {
    await addDelegate(data.issuerDIDRsk);
  }) */

  test('Expect revokeDelegate to throw on missing otherDID', async () => {
    try {
      await revokeDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOtherDID.code);
    }
  });

  // rsk
  test.skip('Expect revokeDelegate to revoke Delegate RSK', async () => {
    await revokeDelegate(data.issuerDIDRsk);
  });
});
