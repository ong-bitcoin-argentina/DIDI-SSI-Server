const { getTokenData } = require('../../../services/TokenService');
const { missingToken } = require('../../../constants/serviceErrors');
const { token, dataResponse } = require('./constants');

describe('services/Token/getTokenData.test.js', () => {
  test('Expect getTokenData to throw on missing token', async () => {
    try {
      await getTokenData(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  test('Expect getTokenData to get valid TokenData', async () => {
    const result = await getTokenData(await token);
    const now = Date.now() / 1000;
    expect(result.payload.iat - now).toBeLessThan(500);
    expect(result.payload.iss).toBe(dataResponse.issuer);
    expect(result.data).not.toBe(null);
  });
});
