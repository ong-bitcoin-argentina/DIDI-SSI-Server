const COMMUNICATION_ERROR = { code: "COMMUNICATION_ERROR", message: "No es posible conetarse con el servidor." };

module.exports = {
	CERTIFICATE_SAVED: "Certificado guardado",
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
		SENT: "Message sent",
		SENDING: function(number) {
			return "Enviando sms a " + number;
		},
		VALIDATION: {
			MESSAGE: code => {
				return "Este es tu código de validacion para validar tu cuenta de DIDI: " + code;
			}
		},
		SUCCESS: {
			SENT: {},
			MATCHED: function(cert) {
				return { certificate: cert };
			}
		},
		ERR: {
			COMMUNICATION_ERROR: COMMUNICATION_ERROR,
			VALIDATION_EXPIRED: {
				code: "VALIDATION_EXPIRED",
				message: "El pedido de validacion para ese número ha expirado"
			},
			NO_VALIDATIONS_FOR_NUMBER: {
				code: "NO_SMSCODE_MATCH",
				message: "No se encontraron pedidos de validacion para ese número."
			},
			NO_SMSCODE_MATCH: { code: "NO_SMSCODE_MATCH", message: "El código de validacion es incorrecto." },
			CREATE: COMMUNICATION_ERROR,
			GET: COMMUNICATION_ERROR
		}
	},
	EMAIL: {
		SENT: "Email sent",
		SUCCESS: {
			SENT: {},
			MATCHED: function(cert) {
				return { certificate: cert };
			}
		},
		ERR: {
			COMMUNICATION_ERROR: COMMUNICATION_ERROR,
			SMS_SEND_ERROR: { code: "SMS_SEND_ERROR", message: "No pudo mandarse el sms" },
			EMAIL_SEND_ERROR: { code: "EMAIL_SEND_ERROR", message: "No pudo mandarse el mail" },
			NO_EMAILCODE_MATCH: { code: "NO_EMAILCODE_MATCH", message: "El código de validacion es incorrecto." },
			NO_VALIDATIONS_FOR_EMAIL: {
				code: "NO_EMAILCODE_MATCH",
				message: "No se encontraron pedidos de validacion para ese mail."
			},
			VALIDATION_EXPIRED: { code: "VALIDATION_EXPIRED", message: "El pedido de validacion para ese mail ha expirado" },
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
			LOGGED_IN: {},
			REGISTERED: {},
			CHANGED_PASS: {},
			CHANGED_PHONE: {},
			CHANGED_EMAIL: {}
		},
		ERR: {
			COMMUNICATION_ERROR: COMMUNICATION_ERROR,
			USER_ALREADY_EXIST: { code: "USER_ALREADY_EXIST", message: "Ese mail ya se encuentra registrado." },
			INVALID_USER: { code: "INVALID_USER", message: "El usuario y contraseña no coinciden" },
			NOMATCH_USER_DID: { code: "NOMATCH_USER_DID", message: "No se encontró ningún usuario con ese did" },
			NOMATCH_USER_EMAIL: {
				code: "NOMATCH_USER_EMAIL",
				message: "No se encontró ningún usuario con ese mail y contraseña"
			},
			MAIL_NOT_VALIDATED: { code: "MAIL_NOT_VALIDATED", message: "Ese mail no fue validado" },
			PHONE_NOT_VALIDATED: { code: "PHONE_NOT_VALIDATED", message: "Ese teléfono no fue validado" },
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
