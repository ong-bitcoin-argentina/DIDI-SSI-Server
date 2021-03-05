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

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const PNF = require("google-libphonenumber").PhoneNumberFormat;

/**
 * Obtenido de DIDI-Ronda
 */ 
exports.normalizePhone = (phone, country = "AR") => {
	let number;
	const finalCountry = country;

	try {
		number = phoneUtil.parseAndKeepRawInput(phone, country);
		// Se remueve el 9 si es que esta delante del codigo de area
		// El número 9 no es requerido para mandar sms
		if (number.getNationalNumber().toString()[0] === "9") {
			const properNumber = number.getNationalNumber().toString().substring(1);
			number = phoneUtil.parseAndKeepRawInput(properNumber, country);
		}
	} catch (error) {
		console.log("===== ERROR on parsing normalized phone =====");
		if (error.message === "Invalid country calling code") {
			// Obtener el 1er número del telefono
			const { 0: firstNumber } = phone;

			if (firstNumber !== "9") {
				phone = `9 ${phone}`;
			}
			number = phoneUtil.parseAndKeepRawInput(phone, finalCountry);
		} else {
			throw error.message;
		}
	}

	// Dar formato E164 al número de teléfono
	return phoneUtil.format(number, PNF.E164);
};
