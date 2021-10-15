const { getPayload } = require('../../../services/TokenService');
const { missingJwt } = require('../../../constants/serviceErrors');
const {
  token, invalidToken, dataResponse, error,
} = require('./constants');

describe('services/Token/getPayload.test.js', () => {
  test('Expect getPayload to throw on missing jwt', async () => {
    try {
      await getPayload(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect getPayload to get invalid Payload', async () => {
    try {
      await getPayload(await invalidToken);
    } catch (e) {
      expect(e.code).toBe(error.code);
    }
  });

  test('Expect getPayload to get a valid Payload', async () => {
    const result = await getPayload(await token);
    const now = Date.now() / 1000;
    expect(result.iat - now).toBeLessThan(500);
    expect(result.iss).toBe(dataResponse.issuer);
  });
});
