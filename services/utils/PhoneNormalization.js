const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const PNF = require("google-libphonenumber").PhoneNumberFormat;

// taken from DIDI-Ronda
exports.normalizePhone = (phone, country = "AR") => {
	let number;
	const finalCountry = country;

	try {
		number = phoneUtil.parseAndKeepRawInput(phone, country);
		// We remove in Argentina numbers the leading 9 before the area code
		// We normalize this so we don't have issues with 9 numbers
		// The 9 is NOT required to send SMS
		if (number.getNationalNumber().toString()[0] === "9") {
			const properNumber = number.getNationalNumber().toString().substring(1);
			number = phoneUtil.parseAndKeepRawInput(properNumber, country);
		}
	} catch (error) {
		console.log("===== ERROR on parsing normalized phone =====");
		if (error.message === "Invalid country calling code") {
			// Get first number from the phone
			const { 0: firstNumber } = phone;

			if (firstNumber !== "9") {
				phone = `9 ${phone}`;
			}
			number = phoneUtil.parseAndKeepRawInput(phone, finalCountry);
		} else {
			throw error.message;
		}
	}

	// Format the phone number to E164 format
	return phoneUtil.format(number, PNF.E164);
};
