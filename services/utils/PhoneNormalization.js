/**
 * La normalización es
 * Simbolo inicial: +
 * Indicativo país (CC): 54
 * Indicativo nacional de destino (NDC): No incluye 9 ni 0.
 *   Ejemplos: 249 Tandil, 11 CABA
 * Número de abonado (SN):
 *   Ejemplos: 1234567 Tandil, 12345678 CABA
 * Número normalizado: +542491234567
*/

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const Messages = require('../../constants/Messages');

exports.normalizePhone = (phone) => {
  let number;

  try {
    number = phoneUtil.parseAndKeepRawInput(phone);
    const region = phoneUtil.getRegionCodeForNumber(number);

    if (!phoneUtil.isValidNumberForRegion(number, region)) {
      throw Messages.SMS.INVALID_NUMBER;
    }
    // Se remueve el 9 si es que esta delante del codigo de area en un numero Argentino
    // El número 9 no es requerido para mandar sms
    if (region === 'AR' && number.getNationalNumber().toString()[0] === '9') {
      const properNumber = number.getNationalNumber().toString().substring(1);
      number = phoneUtil.parseAndKeepRawInput(properNumber, region);
    }
  } catch (error) {
    throw Messages.SMS.INVALID_NUMBER;
  }

  // Dar formato E164 al número de teléfono
  const result = phoneUtil.format(number, PNF.E164);
  return result;
};
