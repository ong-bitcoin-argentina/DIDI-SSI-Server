const COMMUNICATION_ERROR = { code: "COMMUNICATION_ERROR", message: "No es posible conetarse con el servidor." };

module.exports = {
	COMMUNICATION_ERROR: COMMUNICATION_ERROR,
	RENAPER: {
		CREATE: {
			code: "REQ_CREATE",
			message: "No pudo registrarse el pedido de validacion de identidad."
		},
		GET: {
			code: "REQ_GET",
			message: "No pudo obtenerse el pedido de validacion de identidad."
		},
		UPDATE: {
			code: "REQ_UPDATE",
			message: "No pudo actualizarse el pedido de validacion de identidad."
		},
		WEAK_MATCH: {
			code: "WEAK_MATCH",
			message:
				"El resultado arrojado por Renaper tiene un bajo grado de precision, por favor intente sacar mejores fotos."
		},
		SCAN_BAR_CODE: {
			code: "SCAN_BAR_CODE",
			message: "Hubo un error al enviar el codigo de barras, por favor intentelo de nuevo mas tarde"
		},
		NEW_OPERATION: {
			code: "NEW_OPERATION",
			message: "Hubo un error al iniciar el tramite de validacion, por favor intentelo de nuevo mas tarde"
		},
		ADD_FRONT: {
			code: "ADD_FRONT",
			message: "Hubo un error al enviar la foto del frente, por favor intentelo de nuevo mas tarde"
		},
		ADD_BACK: {
			code: "ADD_BACK",
			message: "Hubo un error al enviar la foto del dorso, por favor intentelo de nuevo mas tarde"
		},
		ADD_SELFIE: {
			code: "ADD_SELFIE",
			message: "Hubo un error al enviar la selfie, por favor intentelo de nuevo mas tarde"
		},
		ADD_BAR_CODE: {
			code: "ADD_BAR_CODE",
			message: "Hubo un error al analizar el codigo de barras, por favor intentelo de nuevo mas tarde"
		},
		END_OPERATION: {
			code: "END_OPERATION",
			message: "Hubo un error al analizar los datos, por favor intentelo de nuevo mas tarde"
		}
	},
	CERTIFICATE: {
		ERR: {
			REVOKED: { code: "CERT_REVOKED", message: "Error, la credencial fue revocada" },
			CREATE: { code: "CERT_CREATE_ERROR", message: "Error al crear la credencial." },
			VERIFY: { code: "CERT_VERIFY_ERROR", message: "Error al validar la credencial generada." },
			REVOKE: { code: "CERT_REVOKE_ERROR", message: "Error al dar de baja la credencial." },
			HASH: { code: "CERT_HASH_ERROR", message: "Error al obtener hash de backup." },
			SAVE: { code: "CERT_SAVE_ERROR", message: "Error al guardar la creadencial generada." },
			EXPIRED: { code: "CERT_EXPIRED", message: "Error la credencial ha expirado." }
		},
		HASH: "Hash obtenido",
		REVOKED: "Certificado revocado",
		SAVED: "Certificado guardado",
		CREATED: "Certificado creado",
		EXPIRED: "Certificado vencido",
		VERIFIED: "Certificado validado"
	},
	INDEX: {
		ERR: {
			CONNECTION: "Error de conexion en la base de datos: "
		},
		MSG: {
			CONNECTING: "conectandose a: ",
			CONNECTED: "Base de datos conectada.",
			HELLO_WORLD: "Hola DIDI!",
			RUNNING_ON: "Ejecutandose en puerto ",
			STARTING_WORKER: "Arrancando nuevo worker",
			STARTING_WORKERS: num => {
				return "Inicializando " + num + " workers";
			},
			STARTED_WORKER: pid => {
				return "Worker " + pid + " inicializado";
			},
			ENDED_WORKER: (pid, code, signal) => {
				return "Worker " + pid + " termino con codigo: " + code + ", y señal: " + signal;
			}
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
			CERT: {
				CREATE: {
					code: "CERT_CREATE_ERROR",
					message: "No pudo generarse la credencial vinculando el did y el número."
				}
			},
			SMS_SEND_ERROR: { code: "SMS_SEND_ERROR", message: "No pudo mandarse el sms." },
			ALREADY_EXISTS: { code: "ALREADY_EXISTS", message: "Ese teléfono ya se encuentra asociado a un usuario." },
			VALIDATION_EXPIRED: {
				code: "VALIDATION_EXPIRED",
				message: "El pedido de validacion para ese número ha expirado."
			},
			NO_VALIDATIONS_FOR_NUMBER: {
				code: "NO_VALIDATIONS",
				message: "No se encontraron pedidos de validación para ese número."
			},
			NO_SMSCODE_MATCH: { code: "NO_SMSCODE_MATCH", message: "El código de validacion es incorrecto." },
			CREATE: { code: "VALIDATION_CREATE", message: "El pedido de validacion para ese número no pudo ser creado." },
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
			CERT: {
				CREATE: { code: "CERT_CREATE_ERROR", message: "No pudo generarse la credencial vinculando el did y el mail." }
			},
			EMAIL_SEND_ERROR: { code: "EMAIL_SEND_ERROR", message: "No pudo mandarse el mail." },
			NO_EMAILCODE_MATCH: { code: "NO_EMAILCODE_MATCH", message: "El código de validacion es incorrecto." },
			NO_VALIDATIONS_FOR_EMAIL: {
				code: "NO_VALIDATIONS",
				message: "No se encontraron pedidos de validacion para ese mail."
			},
			ALREADY_EXISTS: { code: "ALREADY_EXISTS", message: "Ese mail ya se encuentra asociado a un usuario." },
			VALIDATION_EXPIRED: { code: "VALIDATION_EXPIRED", message: "El pedido de validacion para ese mail ha expirado." },
			INVALID_DID: { code: "INVALID_DID", message: "El did no se corresponde con ese mail." },
			CREATE: { code: "VALIDATION_CREATE", message: "El pedido de validacion para ese mail no pudo ser creado." },
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
			CHANGED_PHONE: function(cert) {
				return { certificate: cert };
			},
			CHANGED_EMAIL: function(cert) {
				return { certificate: cert };
			}
		},
		ERR: {
			VALIDATE_DID_ERROR: {
				code: "VALIDATE_DID_ERROR",
				message: "Ese did se encuentra autorizado a realizar esa operacion."
			},
			USER_ALREADY_EXIST: { code: "USER_ALREADY_EXIST", message: "Ese mail ya se encuentra registrado." },
			INVALID_USER: { code: "INVALID_USER", message: "El usuario y contraseña no coinciden." },
			INVALID_USER_DID: {
				code: "INVALID_USER_DID",
				message: "El usuario fue generado desde otro teléfono, es necesario recuperar la cuenta para loguearse."
			},
			INVALID_USER_EMAIL: { code: "INVALID_USER_EMAIL", message: "El mail ingresado no corresponde a ese usuario." },
			NOMATCH_USER_DID: { code: "NOMATCH_USER_DID", message: "No se encontró ningún usuario con ese did." },
			NOMATCH_USER_EMAIL: {
				code: "NOMATCH_USER_EMAIL",
				message: "No se encontró ningún usuario con ese mail y contraseña."
			},
			MAIL_NOT_VALIDATED: { code: "MAIL_NOT_VALIDATED", message: "Ese mail no fue validado." },
			PHONE_NOT_VALIDATED: { code: "PHONE_NOT_VALIDATED", message: "Ese teléfono no fue validado." },
			CREATE: { code: "USER_CREATE", message: "Hubo un error al durante la creación  del usuario." },
			GET: { code: "USER_GET", message: "No se pudo obtener el usuario." },
			UPDATE: { code: "USER_UPDATE", message: "No se pudo actualizar el usuario." }
		}
	},
	ISSUER: {
		ERR: {
			CREATE: {
				code: "ALREADY_CREATED",
				message: "Ese usuario ya se encontraba autorizado para emitir certificados."
			},
			DELETE: { code: "ISSUER_DELETE", message: "No se pudo revocar la autorización para emisión de certificados." },
			IS_INVALID: { code: "IS_INVALID", message: "El emisor no esta autorizado para emitir certificados." },
			CERT_SUB_IS_INVALID: {
				code: "CERT_SUB_IS_INVALID",
				message: "No pudo encontrarse ningun usuario registrado en didi con ese DID."
			},
			CERT_IS_INVALID: { code: "CERT_IS_INVALID", message: "El certificado es inválido." },
			REVOKED: { code: "REVOKED", message: "El certificado ha sido revocado." },
			NOT_FOUND: { code: "NOT_FOUND", message: "El certificado no fue emitido." }
		},
		CERT_REVOKED: "El certificado fue revocado.",
		DELETED: "La autorizacion para emitir certificados fue revocada.",
		CREATED: "El emisor fue autorizado a emitir certificados.",
		CERT_SAVED: "El certificado fue guardado.",
		IS_VALID: "El emisor esta autorizado para emitir certificados",
		IS_INVALID: "El emisor no esta autorizado para emitir certificados."
	},
	PUSH: {
		TYPES: {
			NEW_CERT:"NEW_CERT",
			SHARE_REQ:"SHARE_REQ",
			VALIDATION_REQ:"VALIDATION_REQ"
		},
		VALIDATION_REQ: {
			TITLE: "Pedido de Validacion",
			MESSAGE: "Tienes un pedido de validacion para un certificado"
		},
		SHARE_REQ: {
			TITLE: "Pedido de Certificado",
			MESSAGE: "Tienes un pedido de certificado nuevo"
		},
		NEW_CERT: {
			TITLE: "Nuevo Certificado",
			MESSAGE: "Tienes un certificado nuevo"
		}
	},
	DELEGATE: {
		ERR: {
			INVALID_USER: { code: "INVALID_USER", message: "El usuario y contraseña no coinciden." },
			CREATE: { code: "USER_CREATE", message: "El usuario no pudo ser creado." },
			GET: { code: "USER_GET", message: "El usuario no pudo ser obtenido." },
			SET_NAME: { code: "DELEGATE_SET_NAME", message: "El delegado no pudo ser verificado." },
			GET_NAME: { code: "DELEGATE_GET_NAME", message: "El nombre del emisor no pudo ser obtenido." }
		}
	},
	VALIDATION: {
		COMMON_PASSWORD: {
			code: "PARAMETER_TYPE_ERROR",
			message: "La contraseña ingresada es de uso común, por favor ingrese una mas segura."
		},
		PASSWORD_NOT_SAFE: {
			code: "PASSWORD_NOT_SAFE",
			message:
				"La contraseña debe tener caracteres en mayuscúlas, minúsculas, números y caracteres especiales, por favor ingrese una mas segura."
		},
		PASSWORD_TOO_SHORT: {
			code: "PASSWORD_TOO_SHORT",
			message: "La contraseña debe tener al menos 8 caracteres, por favor ingrese una mas segura."
		},
		DOES_NOT_EXIST: function(type) {
			return { code: "PARAMETER_MISSING", message: "falta el campo: " + type };
		},
		MOVILE_PHONE_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un número telefónico"
			};
		},
		EMAIL_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un mail"
			};
		},
		IP_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba una direccion ip"
			};
		},
		STRING_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un texto"
			};
		},
		NUMBER_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un número"
			};
		},
		BOOLEAN_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un booleano ('true' o 'false')"
			};
		},
		BASE64_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un texto en base 64"
			};
		},
		DNI_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba una dni"
			};
		},
		DATE_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message:
					"El campo " +
					field +
					" es incorrecto, se esperaba una fecha con el siguiente formato: 'aaaa-mm-ddThh:mm:ssZ.' "
			};
		},
		LENGTH_INVALID: function(field, min, max) {
			const code = "PARAMETER_LENGTH_ERROR";
			const msgStart = "El campo " + field + " tendría que tener";

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
