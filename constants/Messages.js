module.exports = {
	INDEX: {
		ERR: {
			CONNECTION: "DB Connection Error: ",
			DB_CONNECTION: "Error connecting db."
		},
		MSG: {
			CONNECTING: "connecting to: ",
			CONNECTED: "DB Connected.",
			DB_CONNECTED: "Db connected successfully.",
			HELLO_WORLD: "Hello DIDI!",
			RUNNING_ON: "Running Api on port "
		}
	},
	VALIDATION: {
		DOES_NOT_EXIST: function(type) {
			return { code: "MISSING_PARAMETER", message: "missing parameter: " + type };
		},
		MOVILE_PHONE_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_PHONE_FORMAT",
				message: "the field " + field + " was invalid, expected a mobile phone number"
			};
		},
		EMAIL_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_EMAIL_FORMAT",
				message: "the field " + field + " was invalid, expected an email"
			};
		},
		STRING_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_STRING_FORMAT",
				message: "the field " + field + " was invalid, expected a string"
			};
		},
		BASE64_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_BASE64_FORMAT",
				message: "the field " + field + " was invalid, expected a base64 encoded string"
			};
		},
		DATE_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_DATE_FORMAT",
				message: "the field " + field + " was invalid, expected date-time: 'yyyy-mm-ddThh:mm:ssZ.' "
			};
		},
		LENGTH_INVALID: function(field, min, max) {
			const code = "INVALID_LENGTH";
			const msgStart = "the field " + field + " was supposed to";

			if (min && !max) {
				return {
					code: code,
					message: msgStart + " have more than " + min + " characters"
				};
			}

			if (!min && max) {
				return {
					code: code,
					message: msgStart + " have less than " + max + " characters"
				};
			}

			if (min == max) {
				return {
					code: code,
					message: msgStart + " have " + max + " characters"
				};
			} else {
				return {
					code: code,
					message: msgStart + " be between " + min + " and " + max + " characters long"
				};
			}
		}
	},
	USER: {
		ERR: {
			LOGIN: { code: "USER_LOGIN", message: "Couldn't login" },
			GET_ALL: { code: "USER_GET_ALL", message: "Couldn't get users" },
			GET: { code: "USER_GET", message: "Couldn't get the user" },
			CREATE: { code: "USER_CREATE", message: "Couldn't create the user." },
			EDIT: { code: "USER_EDIT", message: "Couldn't edit the user." },
			DELETE: { code: "USER_DELETE", message: "Couldn't delete the user." }
		}
	}
};
