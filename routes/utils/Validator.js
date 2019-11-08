const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");
const ResponseHandler = require("../utils/ResponseHandler");
const { body, validationResult } = require("express-validator");

// ejecuta validaciones generadas por "validateBody"
module.exports.checkValidationResult = function(req, res, next) {
	const result = validationResult(req);
	if (result.isEmpty()) {
		return next();
	}
	const err = result.array();
	return ResponseHandler.sendErr(res, { code: err[0].msg.code, message: err[0].msg.message });
};

// recibe una lista de paràmetros de validacion y valida que los datos recibidos en el body 
// cumplan con esos paràmetros
module.exports.validateBody = function(params) {
	const validations = [];
	params.forEach(param => {
		let validation;
		if (param.optional) {
			// campo es opcional
			validation = body(param.name).optional();
		} else {
			// campo no es opcional, valida que exista
			validation = body(param.name)
				.not()
				.isEmpty()
				.withMessage(Messages.VALIDATION.DOES_NOT_EXIST(param.name));
		}

		if (param.validate && param.validate.length) {
			param.validate.forEach(validationType => {
				switch (validationType) {
					case Constants.VALIDATION_TYPES.IS_PASSWORD:
						// campo es una contraseña, valida que no estè en la lista de contraseñas comùnes
						validation
							.not()
							.isIn(Constants.COMMON_PASSWORDS)
							.withMessage(Messages.VALIDATION.COMMON_PASSWORD);
						break;
					case Constants.VALIDATION_TYPES.IS_MOBILE_PHONE:
						// campo es un tel, valida que el formato sea el correcto
						validation.isMobilePhone("any").withMessage(Messages.VALIDATION.MOVILE_PHONE_FORMAT_INVALID(param.name));
						break;
					case Constants.VALIDATION_TYPES.IS_EMAIL:
						// campo es un mail, valida que el formato sea el correcto
						validation.isEmail().withMessage(Messages.VALIDATION.EMAIL_FORMAT_INVALID(param.name));
						break;
					case Constants.VALIDATION_TYPES.IS_STRING:
						// campo es un string, valida que lo sea
						validation.isString().withMessage(Messages.VALIDATION.STRING_FORMAT_INVALID(param.name));
						break;
					case Constants.VALIDATION_TYPES.IS_DATE_TIME:
						// campo es una fecha, valida el formato sea 'aaaa-mm-ddThh:mm:ssZ'					
						const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0[0-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]Z)/;
						validation
							.isLength({ min: 20, max: 20 })
							.withMessage(Messages.VALIDATION.LENGTH_INVALID(param.name, 20, 20))
							.matches(regex)
							.withMessage(Messages.VALIDATION.DATE_FORMAT_INVALID(param.name))
							.isString()
							.withMessage(Messages.VALIDATION.STRING_FORMAT_INVALID(param.name));
						break;
				}
			});
		}

		if (param.length) {
			// validaciones de longitud
			validation
				.isLength(param.length)
				.withMessage(Messages.VALIDATION.LENGTH_INVALID(param.name, param.length.min, param.length.max));
		}

		validations.push(validation);
	});
	return validations;
};
