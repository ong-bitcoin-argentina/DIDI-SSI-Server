const { sendValidationCode } = require('../../../services/MailService');
const { missingEmail, missingCode } = require('../../../constants/serviceErrors');

describe('services/Mail/sendValidationCode.test.js', () => {
  test('Expect sendValidationCode to throw on missing email', async () => {
    try {
      await sendValidationCode(undefined, 'code');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect sendValidationCode to throw on missing code', async () => {
    try {
      await sendValidationCode('eMail', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });
});
