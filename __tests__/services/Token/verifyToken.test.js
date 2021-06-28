const { verifyToken } = require('../../../services/TokenService');
const { missingJwt } = require('../../../constants/serviceErrors');
const { tokenData, error } = require('./constants.js');

describe('services/Token/verifyToken.test.js', () => {
  test('Expect verifyToken to throw on missing jwt', async () => {
    try {
      await verifyToken(undefined, 'isUser');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  // token invalido
  test('Expect verifyToken to verifyToken', async () => {
    try {
      await verifyToken(tokenData.tokenData);
    } catch (e) {
      expect(e.code).toBe(error.code);
    }
  });
});
