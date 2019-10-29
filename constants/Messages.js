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
		SUCCESS: {
			SENT: "SUCCESS",
			MATCHED: "SMSCODE_MATCH"
		},
		ERR: {
			COMMUNICATION_ERROR: { code: "COMMUNICATION_ERROR", message: "No es posible conetarse con el servidor." },
			NO_SMSCODE_MATCH: { code: "NO_SMSCODE_MATCH", message: "El código de validacion es incorrecto." }
		}
	},
	EMAIL: {
		SUCCESS: {
			SENT: "SUCCESS",
			MATCHED: "EMAILCODE_MATCH"
		},
		ERR: {
			COMMUNICATION_ERROR: { code: "COMMUNICATION_ERROR", message: "No es posible conetarse con el servidor." },
			NO_EMAILCODE_MATCH: { code: "NO_EMAILCODE_MATCH", message: "El código de validacion es incorrecto." },
			CREATE: { code: "EMAIL_CREATE", message: "No pudo crearse el mail." },
			GET: { code: "EMAIL_GET", message: "No se encontro el mail." }
		},
		VALIDATION: {
			FROM: "Excited User <me@samples.mailgun.org>",
			SUBJECT: "DIDI validation code",
			MESSAGE: code => {
				return (
					"Hola,\n" +
					"Este es tu código de validacion para validar tu cuenta de DIDI\n\n" +
					"CODE: " +
					code +
					"\n" +
					"Si no realizaste el pedido de dicho código por favor comunicate inmediatamente con nuestro servicio al cliente en didi@mailgun.com" +
					"\n\n Saludos," +
					"\nEl equipo de DIDI"
				);
			}
		}
	},
	USER: {
		SUCCESS: {
			REGISTERED: "SUCCESS",
			RECOVERED: "SUCCESS"
		},
		ERR: {
			COMMUNICATION_ERROR: { code: "COMMUNICATION_ERROR", message: "No es posible conetarse con el servidor." },
			USER_ALREADY_EXIST: { code: "USER_ALREADY_EXIST", message: "Ese mail ya se encuentra registrado." },
			INVALID_USER: { code: "INVALID_USER", message: "El usuario y contraseña no coinciden" },
			NOMATCH_USER_DID: { code: "NOMATCH_USER_DID", message: "" }
			/*
			LOGIN: { code: "USER_LOGIN", message: "Couldn't login" },
			GET_ALL: { code: "USER_GET_ALL", message: "Couldn't get users" },
			GET: { code: "USER_GET", message: "Couldn't get the user" },
			CREATE: { code: "USER_CREATE", message: "Couldn't create the user." },
			EDIT: { code: "USER_EDIT", message: "Couldn't edit the user." },
			DELETE: { code: "USER_DELETE", message: "Couldn't delete the user." }
			*/
		}
	},
	VALIDATION: {
		DOES_NOT_EXIST: function(type) {
			return { code: "MISSING_PARAMETER", message: "falta el campo: " + type };
		},
		MOVILE_PHONE_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_PHONE_FORMAT",
				message: "el campo " + field + " es incorrecto, se esperaba un número telefónico"
			};
		},
		EMAIL_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_EMAIL_FORMAT",
				message: "el campo " + field + " es incorrecto, se esperaba un mail"
			};
		},
		STRING_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_STRING_FORMAT",
				message: "el campo " + field + " es incorrecto, se esperaba un texto"
			};
		},
		BASE64_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_BASE64_FORMAT",
				message: "el campo " + field + " es incorrecto, se esperaba un texto en base 64"
			};
		},
		DATE_FORMAT_INVALID: function(field) {
			return {
				code: "INVALID_DATE_FORMAT",
				message:
					"el campo " +
					field +
					" es incorrecto, se esperaba una fecha con el siguiente formato: 'aaaa-mm-ddThh:mm:ssZ.' "
			};
		},
		LENGTH_INVALID: function(field, min, max) {
			const code = "INVALID_LENGTH";
			const msgStart = "el campo " + field + " tendria que tener ";

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
