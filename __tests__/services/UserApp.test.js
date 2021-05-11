const { findByUserDID, createByTokens } = require('../../services/UserAppService');
const { missingUserDID, missingUserToken, missingAppToken } = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
  * findByUserDID
   */
  test('Expect findByUserDID to throw on missing userDid', async () => {
    try {
      await findByUserDID(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingUserDID.code);
    }
  });

  /**
  * createByTokens
  */
  test('Expect createByTokens to throw on missing userToken', async () => {
    try {
      await createByTokens(undefined, 'appToken');
    } catch (e) {
      expect(e.code).toMatch(missingUserToken.code);
    }
  });
  test('Expect createByTokens to throw on missing AppToken', async () => {
    try {
      await createByTokens('userToken', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingAppToken.code);
    }
  });
});
