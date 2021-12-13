const { missingJwt } = require('../../../constants/serviceErrors');
const { verifyUserByToken } = require('../../../services/UserService');

describe('services/UserService/verifyUserByToken.test', () => {
  test('Expect verifyUserByToken to throw on missing jwt', async () => {
    try {
      await verifyUserByToken(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
});
