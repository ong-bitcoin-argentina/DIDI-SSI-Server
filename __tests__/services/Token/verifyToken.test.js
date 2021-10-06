const { verifyToken } = require('../../../services/TokenService');
const { missingJwt } = require('../../../constants/serviceErrors');
const {
  dataResponse, error, token, invalidToken,
} = require('./constants');

describe('services/Token/verifyToken.test.js', () => {
  test('Expect verifyToken to throw on missing jwt', async () => {
    try {
      await verifyToken(undefined, 'isUser');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect verifyToken to throw invalid token', async () => {
    try {
      await verifyToken(invalidToken);
    } catch (e) {
      expect(e.code).toBe(error.code);
    }
  });

  test('Expect verifyToken to verifyToken', async () => {
    const result = await verifyToken(await token);
    expect(result.issuer).toBe(dataResponse.issuer);
  });
});
