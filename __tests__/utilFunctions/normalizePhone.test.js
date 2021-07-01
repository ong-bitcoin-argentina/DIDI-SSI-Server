const { normalizePhone } = require('../../services/utils/PhoneNormalization');
const Messages = require('../../constants/Messages');
const { countries } = require('./constants');

describe('Normalize phone', () => {
  test('Expect to normalize with 9, Argentine number. +xx9xxxxx', () => {
    const number = normalizePhone('+5492494123456');
    expect(number).toBe(countries.argentina.validNumber);
  });

  test('Expect error with 9 and 0. +xx90xxxx', async () => {
    try {
      await normalizePhone(countries.argentina.invalidNumber);
    } catch (e) {
      expect(e).toMatch(Messages.SMS.INVALID_NUMBER);
    }
  });

  test('Expect error without initial +', async () => {
    try {
      await normalizePhone('542494123456');
    } catch (e) {
      expect(e).toMatch(Messages.SMS.INVALID_NUMBER);
    }
  });

  test('Expect to normalize Bolivia number', () => {
    const number = normalizePhone(countries.bolivia.validNumber);
    expect(number).toBe(countries.bolivia.validNumber);
  });

  test('Expect error with Bolivia invalid number', async () => {
    try {
      await normalizePhone(countries.bolivia.invalidNumber);
    } catch (e) {
      expect(e).toMatch(Messages.SMS.INVALID_NUMBER);
    }
  });

  test('Expect to normalize Ecuador number', () => {
    const number = normalizePhone(countries.ecuador.validNumber);
    expect(number).toBe(countries.ecuador.validNumber);
  });

  test('Expect error with Ecuador invalid number', async () => {
    try {
      await normalizePhone(countries.ecuador.invalidNumber);
    } catch (e) {
      expect(e).toMatch(Messages.SMS.INVALID_NUMBER);
    }
  });

  test('Expect to normalize Chile number', () => {
    const number = normalizePhone(countries.chile.validNumber);
    expect(number).toBe(countries.chile.validNumber);
  });

  test('Expect error with Chile invalid number', async () => {
    try {
      await normalizePhone(countries.chile.invalidNumber);
    } catch (e) {
      expect(e).toMatch(Messages.SMS.INVALID_NUMBER);
    }
  });

  test('Expect to normalize Costa Rica number', () => {
    const number = normalizePhone(countries.costaRica.validNumber);
    expect(number).toBe(countries.costaRica.validNumber);
  });

  test('Expect error with Costa Rica invalid number', async () => {
    try {
      await normalizePhone(countries.costaRica.invalidNumber);
    } catch (e) {
      expect(e).toMatch(Messages.SMS.INVALID_NUMBER);
    }
  });

  test('Expect to normalize Panama number', () => {
    const number = normalizePhone(countries.panama.validNumber);
    expect(number).toBe(countries.panama.validNumber);
  });

  test('Expect error with Panama invalid number', async () => {
    try {
      await normalizePhone(countries.panama.invalidNumber);
    } catch (e) {
      expect(e).toMatch(Messages.SMS.INVALID_NUMBER);
    }
  });

  test('Expect to normalize Peru number', () => {
    const number = normalizePhone(countries.peru.validNumber);
    expect(number).toBe(countries.peru.validNumber);
  });

  test('Expect error with Peru invalid number', async () => {
    try {
      await normalizePhone(countries.peru.invalidNumber);
    } catch (e) {
      expect(e).toMatch(Messages.SMS.INVALID_NUMBER);
    }
  });
});
