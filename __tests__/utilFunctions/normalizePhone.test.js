const { normalizePhone }  = require("../../routes/utils/PhoneNormalization");

describe('Normalize phone', () => {
  const NORMALIZED_NUMBER = "+542491234567";

  test('Expect to normalize with 9. +xx9xxxxx', () => {
    const number = normalizePhone('+5492491234567');
    expect(number).toBe(NORMALIZED_NUMBER);
  });

  test('Expect to normalize with 9 and 0. +xx90xxxx', () => {
    const number = normalizePhone('+54902491234567');
    expect(number).toBe(NORMALIZED_NUMBER);
  });

  test('Expect to normalize without initial + and 0. xx0xxxx', () => {
    const number = normalizePhone('5402491234567');
    expect(number).toBe(NORMALIZED_NUMBER);
  });

  test('Expect to normalize without initial + and initial 9. 9xxxx', () => {
    const number = normalizePhone('92491234567');
    expect(number).toBe(NORMALIZED_NUMBER);
  });

  test('Expect to normalize without initial +, and initial 9 and 0. 90xxxx', () => {
    const number = normalizePhone('902491234567');
    expect(number).toBe(NORMALIZED_NUMBER);
  })

  test('Expect to normalize initial + and initial 0. 0xxxx ', () => {
    const number = normalizePhone('02491234567');
    expect(number).toBe(NORMALIZED_NUMBER);
  });

  test('Expect to normalize with', () => {
    const number = normalizePhone('2491234567');
    expect(number).toBe(NORMALIZED_NUMBER);
  });
});