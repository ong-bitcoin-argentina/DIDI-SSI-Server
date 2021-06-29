const { verifyToken } = require('../../../services/TokenService');
const { missingJwt } = require('../../../constants/serviceErrors');
const { tokenData, dataResponse, error } = require('./constants.js');

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
      await verifyToken(tokenData.badToken);
    } catch (e) {
      expect(e.code).toBe(error.code);
    }
  });
  test('Expect verifyToken to verifyToken', async () => {
    const result = await verifyToken(tokenData.goodToken);
    expect(result.payload.iat).toBe(dataResponse.good.iat);
    expect(result.payload.sub).toBe(dataResponse.good.sub);
    expect(result.issuer).toBe(dataResponse.good.issuer);
  });
});
