const {
  getByMail, sendValidationCode, create, validateMail, isValid, isValidated,
} = require('../../services/MailService');

const { missingEmail, missingCode, missingDid } = require('../../constants/serviceErrors');

describe('Should be green', () => {
  test('Expect getByMail to throw on missing email', async () => {
    try {
      await getByMail(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

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

  test('Expect create to throw on missing email', async () => {
    try {
      await create(undefined, 'code', 'did');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect create to throw on missing code', async () => {
    try {
      await create('email', undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  test('Expect create to throw on missing did', async () => {
    try {
      await create('email', 'code', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect validateMail to throw on missing mail', async () => {
    try {
      await validateMail(undefined, 'code');
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

  test('Expect isValid to throw on missing email', async () => {
    try {
      await isValid(undefined, 'code');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect isValid to throw on missing code', async () => {
    try {
      await isValid('email', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

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
});
