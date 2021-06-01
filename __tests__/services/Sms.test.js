const {
  getByPhoneNumber,
  sendValidationCode,
  create,
  validatePhone,
  isValid,
  isValidated,
} = require('../../services/SmsService');

const {
  missingDid, missingPhoneNumber, missingCode,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * getByPhoneNumber
   */
  test('Expect getByPhoneNumber to throw on missing phoneNumber', async () => {
    try {
      await getByPhoneNumber(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  /**
   * sendValidationCode
   */
  test('Expect sendValidationCode to throw on missing phoneNumber', async () => {
    try {
      await sendValidationCode(undefined, 'code');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect sendValidationCode to throw on missing code', async () => {
    try {
      await sendValidationCode('phoneNumber', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  /**
   * create
   */
  test('Expect create to throw on missing phoneNumber', async () => {
    try {
      await create(undefined, 'code', 'did');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect create to throw on missing code', async () => {
    try {
      await create('phoneNumber', undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  /**
   * validatePhone
   */
  test('Expect validatePhone to throw on missing phone', async () => {
    try {
      await validatePhone(undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect validatePhone to throw on missing did', async () => {
    try {
      await validatePhone('phone', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * isValid
   */
  test('Expect isValid to throw on missing phoneNumber', async () => {
    try {
      await isValid(undefined, 'code');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect isValid to throw on missing code', async () => {
    try {
      await isValid('phoneNumber', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCode.code);
    }
  });

  /**
   * isValidated
   */
  test('Expect isValidated to throw on missing did', async () => {
    try {
      await isValidated(undefined, 'phone');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect isValidated to throw on missing phone', async () => {
    try {
      await isValidated('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });
});
