const { getTokenData } = require('../../../services/TokenService');
const { missingToken } = require('../../../constants/serviceErrors');
const { tokenData, dataResponse } = require('./constants.js');

describe('services/Token/getTokenData.test.js', () => {
  test('Expect getTokenData to throw on missing token', async () => {
    try {
      await getTokenData(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  test('Expect getTokenData to get invalid TokenData', async () => {
    const result = await getTokenData(tokenData.badToken);
    expect(result.payload.sub).toBe(dataResponse.bad.sub);
    expect(result.payload.iat).toBe(dataResponse.bad.iat);
  });

  test('Expect getTokenData to get valid TokenData', async () => {
    const result = await getTokenData(tokenData.goodToken);
    expect(result.payload.iat).toBe(dataResponse.good.iat);
    expect(result.payload.sub).toBe(dataResponse.good.sub);
  });
});
