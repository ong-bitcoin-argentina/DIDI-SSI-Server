const { getTokenData, getPayload, verifyToken } = require('../../services/TokenService');
const {
  missingToken, missingJwt, missingIsUser,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * getTokenData
   */
  test('Expect getTokenData to throw on missing token', async () => {
    try {
      await getTokenData(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  /**
   * getPayload
   */
  test('Expect getPayload to throw on missing jwt', async () => {
    try {
      await getPayload(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  /**
   * verifyToken
   */
  test('Expect verifyToken to throw on missing jwt', async () => {
    try {
      await verifyToken(undefined, 'isUser');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
});
