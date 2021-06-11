const { sendValidationCode } = require('../../../services/SmsService');
const {
  missingPhoneNumber, missingCode,
} = require('../../../constants/serviceErrors');

describe('Should be green', () => {
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

  // si se ingresa un número de telefono válido funciona
  test.skip('Expect sendValidationCode to be Success', async () => {
    const result = await sendValidationCode('+542215559612', '12345');
    expect(result).not.toBeNull();
  });

  /*  Error: The 'To' number +542211234567 is not a valid phone number.
      status: 400,
      code: 21211,
      moreInfo: 'https://www.twilio.com/docs/errors/21211',
      details: undefined
  */
  test('Expect sendValidationCode to  be Error', async () => {
    try {
      await sendValidationCode('+542211234567', '12345');
    } catch (e) {
      expect(e.code).toMatch('SMS_SEND_ERROR');
    }
  });
});
