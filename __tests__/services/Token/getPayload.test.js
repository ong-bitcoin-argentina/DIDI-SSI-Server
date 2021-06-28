const { getPayload } = require('../../../services/TokenService');
const { missingJwt } = require('../../../constants/serviceErrors');
const { tokenData, payloadData } = require('./constants.js');

describe('services/Token/getPayload.test.js', () => {
  test('Expect getPayload to throw on missing jwt', async () => {
    try {
      await getPayload(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect getPayload to getPayload', async () => {
    const result = await getPayload(tokenData.tokenData);
    expect(result.sub).toBe(payloadData.sub);
    expect(result.iat).toBe(payloadData.iat);
  });
});
