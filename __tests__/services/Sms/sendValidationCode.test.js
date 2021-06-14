const { sendValidationCode } = require('../../../services/SmsService');
const {
  missingPhoneNumber, missingCode,
} = require('../../../constants/serviceErrors');
const { appData } = require('./constans');

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
    const result = await sendValidationCode(appData.phoneNumber, appData.code);
    expect(result).not.toBeNull();
  });

  test('Expect sendValidationCode to throw Error', async () => {
    try {
      await sendValidationCode(appData.otherPhoneNumber, appData.code);
    } catch (e) {
      expect(e.code).toMatch('SMS_SEND_ERROR');
    }
  });
});
