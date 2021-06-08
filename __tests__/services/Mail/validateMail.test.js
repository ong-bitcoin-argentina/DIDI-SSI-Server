const { validateMail } = require('../../../services/MailService');
const { missingEmail, missingDid } = require('../../../constants/serviceErrors');

describe('services/Mail/validateMail.test.js', () => {
  test('Expect validateMail to throw on missing mail', async () => {
    try {
      await validateMail(undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect validateMail to throw on missing did', async () => {
    try {
      await validateMail('mail', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
});
