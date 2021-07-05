const { getTokenData } = require('../../../services/TokenService');
const { missingToken } = require('../../../constants/serviceErrors');
const { token, dataResponse } = require('./constants.js');

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
    expect(result.payload.iat).toBe(dataResponse.iat);
    expect(result.payload.sub).toBe(dataResponse.sub);
  });
});
