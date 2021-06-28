const { getTokenData } = require('../../../services/TokenService');
const { missingToken } = require('../../../constants/serviceErrors');
const { tokenData, payloadData } = require('./constants.js');

describe('services/Token/getTokenData.test.js', () => {
  test('Expect getTokenData to throw on missing token', async () => {
    try {
      await getTokenData(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  test('Expect getTokenData to getTokenData', async () => {
    const result = await getTokenData(tokenData.tokenData);
    expect(result.payload.sub).toBe(payloadData.sub);
    expect(result.payload.iat).toBe(payloadData.iat);
  });
});
