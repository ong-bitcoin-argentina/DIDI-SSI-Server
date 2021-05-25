const { findByDID } = require('../../../services/AppAuthService');
const {
  missingDid,
} = require('../../../constants/serviceErrors');

describe('Should be green', () => {
  test('Expect findByDID to throw on missing did', async () => {
    try {
      await findByDID(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
});
