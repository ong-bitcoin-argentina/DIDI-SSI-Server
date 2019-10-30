const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");
const ResponseHandler = require("../utils/ResponseHandler");
const { body, validationResult } = require("express-validator");

class Validator {
	static checkValidationResult(req, res, next) {
		const result = validationResult(req);
		if (result.isEmpty()) {
			return next();
		}
		const err = result.array();
		return ResponseHandler.sendErr(res, { code: err[0].msg.code, message: err[0].msg.message });
	}
	static validateBody(params) {
		const validations = [];
		params.forEach(param => {
			let validation;
			if (param.optional) {
				validation = body(param.name).optional();
			} else {
				validation = body(param.name)
					.not()
					.isEmpty()
					.withMessage(Messages.VALIDATION.DOES_NOT_EXIST(param.name));
			}

			if (param.validate && param.validate.length) {
				param.validate.forEach(validationType => {
					switch (validationType) {
						case Constants.VALIDATION_TYPES.IS_PASSWORD:
							validation
								.not()
								.isIn(Constants.COMMON_PASSWORDS)
								.withMessage(Messages.VALIDATION.COMMON_PASSWORD);
							break;
						case Constants.VALIDATION_TYPES.IS_MOBILE_PHONE:
							validation.isMobilePhone("any").withMessage(Messages.VALIDATION.MOVILE_PHONE_FORMAT_INVALID(param.name));
							break;
						case Constants.VALIDATION_TYPES.IS_EMAIL:
							validation.isEmail().withMessage(Messages.VALIDATION.EMAIL_FORMAT_INVALID(param.name));
							break;
						case Constants.VALIDATION_TYPES.IS_BASE_64:
							validation.isBase64().withMessage(Messages.VALIDATION.BASE64_FORMAT_INVALID(param.name));
							break;
						case Constants.VALIDATION_TYPES.IS_STRING:
							validation.isString().withMessage(Messages.VALIDATION.STRING_FORMAT_INVALID(param.name));
							break;
						case Constants.VALIDATION_TYPES.IS_DATE_TIME:
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
				validation
					.isLength(param.length)
					.withMessage(Messages.VALIDATION.LENGTH_INVALID(param.name, param.length.min, param.length.max));
			}

			validations.push(validation);
		});
		return validations;
	}
}

module.exports = Validator;
