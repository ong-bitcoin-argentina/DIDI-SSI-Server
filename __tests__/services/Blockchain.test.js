const { addDelegate, revokeDelegate, validDelegate } = require('../../services/BlockchainService');
const {
  missingOtherDID, missingIssuerDid,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * addDelegate
   */
  test('Expect addDelegate to throw on missing issuerDID', async () => {
    try {
      await addDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });

  /**
   * revokeDelegate
   */
  test('Expect revokeDelegate to throw on missing otherDID', async () => {
    try {
      await revokeDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOtherDID.code);
    }
  });

  /**
   * validDelegate
   */
  test('Expect validDelegate to throw on missing issuerDID', async () => {
    try {
      await validDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });
});
