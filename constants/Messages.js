const COMMUNICATION_ERROR = { code: "COMMUNICATION_ERROR", message: "No es posible conetarse con el servidor." };

module.exports = {
	INDEX: {
		ERR: {
			CONNECTION: "Error de conexion en la base de datos: "
		},
		MSG: {
			CONNECTING: "conectandose a: ",
			CONNECTED: "Base de datos conectada.",
			HELLO_WORLD: "Hola DIDI!",
			RUNNING_ON: "Ejecutandose en puerto "
		}
	},
	SMS: {
		VALIDATION: {
			FROM: "DIDI",
			SUBJECT: "DIDI validation code",
			MESSAGE: code => {
				return (
					"Hola,\n" +
					"Este es tu código de validacion para validar tu cuenta de DIDI\n\n" +
					"CODE: " +
					code +
					"\n\n" +
					"Si no realizaste el pedido de dicho código por favor comunicate inmediatamente con nuestro servicio al cliente en didi@mailgun.com\n\n" +
					"Saludos,\n" +
					"El equipo de DIDI"
				);
			}
		},
		SUCCESS: {
			VALIDATED: "VALIDATED",
			NOT_VALIDATED: "NOT VALIDATED",
			SENT: "SUCCESS",
			MATCHED: "SMSCODE_MATCH"
		},
		ERR: {
			COMMUNICATION_ERROR: COMMUNICATION_ERROR,
			NO_SMSCODE_MATCH: { code: "NO_SMSCODE_MATCH", message: "El código de validacion es incorrecto." },
			CREATE: COMMUNICATION_ERROR,
			GET: COMMUNICATION_ERROR
		}
	},
	EMAIL: {
		SUCCESS: {
			VALIDATED: "VALIDATED",
			NOT_VALIDATED: "NOT VALIDATED",
			SENT: "SUCCESS",
			MATCHED: "EMAILCODE_MATCH"
		},
		ERR: {
			COMMUNICATION_ERROR: COMMUNICATION_ERROR,
			NO_EMAILCODE_MATCH: { code: "NO_EMAILCODE_MATCH", message: "El código de validacion es incorrecto." },
			INVALID_DID: { code: "INVALID_DID", message: "El did no se corresponde con ese mail" },
			CREATE: COMMUNICATION_ERROR,
			GET: COMMUNICATION_ERROR
		},
		VALIDATION: {
			FROM: "Didi admin <me@samples.mailgun.org>",
			SUBJECT: "DIDI validation code",
			MESSAGE: code => {
				return (
					"Hola,\n" +
					"Este es tu código de validacion para validar tu cuenta de DIDI\n\n" +
					"CODE: " +
					code +
					"\n\n" +
					"Si no realizaste el pedido de dicho código por favor comunicate inmediatamente con nuestro servicio al cliente en didi@mailgun.com\n\n" +
					"Saludos,\n" +
					"El equipo de DIDI"
				);
			}
		}
	},
	USER: {
		SUCCESS: {
			LOGGED_IN: "SUCCESS",
			REGISTERED: "SUCCESS",
			CHANGED_PASS: "SUCCESS",
			CHANGED_PHONE: "SUCCESS",
			CHANGED_EMAIL: "SUCCESS"
		},
		ERR: {
			COMMUNICATION_ERROR: COMMUNICATION_ERROR,
			USER_ALREADY_EXIST: { code: "USER_ALREADY_EXIST", message: "Ese mail ya se encuentra registrado." },
			INVALID_USER: { code: "INVALID_USER", message: "El usuario y contraseña no coinciden" },
			NOMATCH_USER_DID: { code: "NOMATCH_USER_DID", message: "No se encontró ningún usuario con ese did y mail" },
			NOMATCH_USER_EMAIL: {
				code: "NOMATCH_USER_EMAIL",
				message: "No se encontró ningún usuario con ese mail y contraseña"
			},
			CREATE: COMMUNICATION_ERROR,
			GET: COMMUNICATION_ERROR,
			UPDATE: COMMUNICATION_ERROR
		}
	},
	VALIDATION: {
		COMMON_PASSWORD: {
			code: "PARAMETER_TYPE_ERROR",
			message: "La contraseña ingresada es de uso común, por favor ingrese una mas segura."
		},
		DOES_NOT_EXIST: function(type) {
			return { code: "PARAMETER_MISSING", message: "falta el campo: " + type };
		},
		MOVILE_PHONE_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "el campo " + field + " es incorrecto, se esperaba un número telefónico"
			};
		},
		EMAIL_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "el campo " + field + " es incorrecto, se esperaba un mail"
			};
		},
		STRING_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "el campo " + field + " es incorrecto, se esperaba un texto"
			};
		},
		BASE64_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "el campo " + field + " es incorrecto, se esperaba un texto en base 64"
			};
		},
		DATE_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message:
					"el campo " +
					field +
					" es incorrecto, se esperaba una fecha con el siguiente formato: 'aaaa-mm-ddThh:mm:ssZ.' "
			};
		},
		LENGTH_INVALID: function(field, min, max) {
			const code = "PARAMETER_TYPE_ERROR";
			const msgStart = "el campo " + field + " tendria que tener";

			if (min && !max) {
				return {
					code: code,
					message: msgStart + " mas que " + min + " caracteres"
				};
			}

			if (!min && max) {
				return {
					code: code,
					message: msgStart + " menos que " + max + " caracteres"
				};
			}

			if (min == max) {
				return {
					code: code,
					message: msgStart + " exactamete " + max + " caracteres"
				};
			} else {
				return {
					code: code,
					message: msgStart + " entre " + min + " y " + max + " caracteres"
				};
			}
		}
	}
};
