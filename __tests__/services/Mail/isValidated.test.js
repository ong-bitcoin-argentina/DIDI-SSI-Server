const { isValidated } = require('../../../services/MailService');
const { missingEmail, missingDid } = require('../../../constants/serviceErrors');

describe('Should be green', () => {
  test('Expect isValidated to throw on missing did', async () => {
    try {
      await isValidated(undefined, 'email');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect isValidated to throw on missing email', async () => {
    try {
      await isValidated('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect isValidated to throw on missing email', async () => {
    try {
      await isValidated('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });
});
