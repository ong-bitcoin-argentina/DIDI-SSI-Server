const { getPayload } = require('../../../services/TokenService');
const { missingJwt } = require('../../../constants/serviceErrors');
const { tokenData, dataResponse } = require('./constants.js');

describe('services/Token/getPayload.test.js', () => {
  test('Expect getPayload to throw on missing jwt', async () => {
    try {
      await getPayload(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect getPayload to get invalid Payload', async () => {
    const result = await getPayload(tokenData.badToken);
    expect(result.sub).toBe(dataResponse.bad.sub);
    expect(result.iat).toBe(dataResponse.bad.iat);
  });

  test('Expect getPayload to get a valid Payload', async () => {
    const result = await getPayload(tokenData.goodToken);
    expect(result.sub).toBe(dataResponse.good.sub);
    expect(result.iat).toBe(dataResponse.good.iat);
  });
});
