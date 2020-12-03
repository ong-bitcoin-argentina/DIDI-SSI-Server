const COMMUNICATION_ERROR = {
	code: "COMMUNICATION_ERROR",
	message: "No es posible conetarse con el servidor, por favor inténtelo de nuevo más tarde."
};

module.exports = {
	COMMUNICATION_ERROR: COMMUNICATION_ERROR,
	SHAREREQUEST: {
		ERR: {
			CREATE: { code: "SHARE_REQUEST_ERROR", message: "Error al crear el Share Request." },
			NOT_FOUND: {
				code: "SHARE_REQUEST_NOT_FOUND",
				message: "No se encuentra el Share Request, es probable que haya expirado."
			},
			GET: { code: "SHARE_REQUEST_GET", message: "El Share Request no puedo ser obtenido." },
			USER_NOT_VALID: { code: "USER_NOT_VALID", message: "El Usuario no tiene permiso para ver este Share Request" }
		}
	},
	CERTIFICATE: {
		ERR: {
			REVOKED: { code: "CERT_REVOKED", message: "Error, la credencial fue revocada, es necesario generar una nueva." },
			CREATE: {
				code: "CERT_CREATE_ERROR",
				message: "Error al crear la credencial, por favor inténtelo de nuevo más tarde."
			},
			VERIFY: {
				code: "CERT_VERIFY_ERROR",
				message: "Error al validar la credencial generada, por favor inténtelo de nuevo más tarde."
			},
			REVOKE: {
				code: "CERT_REVOKE_ERROR",
				message: "Error al dar de baja la credencial, por favor inténtelo de nuevo más tarde."
			},
			HASH: {
				code: "CERT_HASH_ERROR",
				message: "Error al obtener hash de backup, por favor inténtelo de nuevo más tarde."
			},
			SAVE: {
				code: "CERT_SAVE_ERROR",
				message: "Error al guardar la creadencial generada, por favor inténtelo de nuevo más tarde."
			},
			EXPIRED: { code: "CERT_EXPIRED", message: "Error la credencial ha expirado, es necesario generar una nueva." }
		},
		HASH: "Hash obtenido",
		REVOKED: "Certificado revocado",
		SAVED: "Certificado guardado",
		CREATED: "Certificado creado",
		EXPIRED: "Certificado vencido",
		VERIFIED: "Certificado validado"
	},
	DELEGATE: {
		ERR: {
			INVALID_USER: {
				code: "INVALID_USER",
				message:
					"El usuario y contraseña no coinciden, por favor verifique que estas sean correctas y vuelva a intentarlo."
			},
			CREATE: {
				code: "USER_CREATE",
				message: "El usuario no pudo ser creado, por favor inténtelo de nuevo más tarde."
			},
			GET: { code: "USER_GET", message: "El usuario no pudo ser obtenido, por favor inténtelo de nuevo más tarde." },
			GET_DELEGATE: { code: "GET_DELEGATE", message: "No pudo validarse la delegación con el did provisto." },
			SET_NAME: {
				code: "DELEGATE_SET_NAME",
				message: "El delegado no pudo ser verificado, por favor inténtelo de nuevo más tarde."
			},
			GET_NAME: {
				code: "DELEGATE_GET_NAME",
				message: "El nombre del emisor no pudo ser obtenido, por favor inténtelo de nuevo más tarde."
			}
		}
	},
	EMAIL: {
		SENT: "Email sent",
		SUCCESS: {
			SENT: {},
			MATCHED: function (cert) {
				return { certificate: cert };
			}
		},
		ERR: {
			CERT: {
				CREATE: {
					code: "CERT_CREATE_ERROR",
					message:
						"No pudo generarse la credencial vinculando el did y el mail, por favor inténtelo de nuevo más tarde."
				}
			},
			EMAIL_SEND_ERROR: { code: "EMAIL_SEND_ERROR", message: "No pudo mandarse el mail." },
			NO_EMAILCODE_MATCH: {
				code: "NO_EMAILCODE_MATCH",
				message:
					"El código de validacion es incorrecto, por favor verifique su direccion de correo, un mail con el codigo de validacion deberia encontrarse alli."
			},
			NO_VALIDATIONS_FOR_EMAIL: {
				code: "NO_VALIDATIONS",
				message: "No se encontraron pedidos de validacion para ese mail."
			},
			ALREADY_EXISTS: {
				code: "ALREADY_EXISTS",
				message: "Ese mail ya se encuentra asociado a un usuario, por favor elija otro."
			},
			VALIDATION_EXPIRED: {
				code: "VALIDATION_EXPIRED",
				message:
					"El pedido de validacion para ese mail ha expirado, es necesario realizar un nuevo pedido de validacion."
			},
			INVALID_DID: { code: "INVALID_DID", message: "El did no se corresponde con ese mail." },
			CREATE: {
				code: "VALIDATION_CREATE",
				message: "El pedido de validacion para ese mail no pudo ser creado, por favor inténtelo de nuevo más tarde."
			},
			GET: COMMUNICATION_ERROR
		},
		VALIDATION: {
			FROM: "ai·di <no-responder@didi.org.ar>",
			SUBJECT: "Validación de correo electrónico en ai·di",
			MESSAGE: code => {
				return `¡Hola!\nTe damos la bienvenida desde el Equipo de App ai.di.\nPara terminar el proceso de darte de alta copiá este código de 6 dígitos: ${code} e ingresalo en la pantalla que aparece en la aplicación ai·di.\n\nDe esta manera garantizamos que esta cuenta de correo te pertenece y protegemos tu información.\n\n¡Qué alegría que formes parte!\n\nSaludos,\nEquipo ai.di - Proyecto DIDI`;
			}
		}
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
				return "Worker " + pid + " termino con código: " + code + ", y señal: " + signal;
			}
		}
	},
	ISSUER: {
		ERR: {
			CREATE: {
				code: "ALREADY_CREATED",
				message: "Ese usuario ya se encontraba autorizado para emitir certificados."
			},
			DELETE: {
				code: "ISSUER_DELETE",
				message:
					"No se pudo revocar la autorización para emisión de certificados, por favor inténtelo de nuevo más tarde."
			},
			IS_INVALID: {
				code: "IS_INVALID",
				message:
					"El emisor no esta autorizado para emitir certificados, por favor contacte a un administrador para obtener dicha autorizacion."
			},
			CERT_SUB_IS_INVALID: {
				code: "CERT_SUB_IS_INVALID",
				message:
					"No pudo encontrarse ningun usuario registrado en ai·di con ese DID, solo pueden emitirse certificados a usuarios registrados."
			},
			CERT_IS_INVALID: { code: "CERT_IS_INVALID", message: "El certificado es inválido." },
			ISSUER_IS_INVALID: { code: "ISSUER_IS_INVALID", message: "El issuer es inválido." },
			REVOKED: {
				code: "REVOKED",
				message: "El certificado ha sido revocado, esta operacion solo esta permitida sobre certificados activos."
			},
			NOT_FOUND: {
				code: "NOT_FOUND",
				message:
					"No se encontro registro alguno del certificado, esta operacion esta permitida solo para certificados emitidos por entidades autorizadas."
			},
			NAME_EXISTS: {
				code: "NAME_EXISTS",
				message: "Ya existe un issuer con ese nombre."
			},
			DID_EXISTS: {
				code: "DID_EXISTS",
				message: "Ya existe un issuer con ese did."
			},
			COULDNT_PERSIST: {
				code: "COULDNT_PERSIST",
				message: "No se pudo persistir la delegación en blockchain."
			},
			ALREADY_DELEGATE: {
				code: "DELEGATE_EXISTS",
				message: "Ya existe una delegación con ese did."
			}
		},
		CERT_REVOKED: "El certificado fue revocado.",
		DELETED: "La autorizacion para emitir certificados fue revocada.",
		CREATED: "El emisor fue autorizado a emitir certificados.",
		CERT_SAVED: "El certificado fue guardado.",
		IS_VALID: "El emisor esta autorizado para emitir certificados"
	},
	PUSH: {
		TYPES: {
			NEW_CERT: "NEW_CERT",
			SHARE_REQ: "SHARE_REQ",
			VALIDATION_REQ: "VALIDATION_REQ"
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
			TITLE: undefined,
			MESSAGE: "Tenés una nueva Credencial disponible para descargar en ai·di"
		}
	},
	RENAPER: {
		CREATE: {
			code: "REQ_CREATE",
			message: "No pudo registrarse el pedido de validacion de identidad, por favor inténtelo de nuevo más tarde."
		},
		GET: {
			code: "REQ_GET",
			message: "No pudo obtenerse el pedido de validacion de identidad, por favor inténtelo de nuevo más tarde."
		},
		UPDATE: {
			code: "REQ_UPDATE",
			message: "No pudo actualizarse el pedido de validacion de identidad, por favor inténtelo de nuevo más tarde."
		},
		WEAK_MATCH: {
			code: "WEAK_MATCH",
			message:
				"El resultado arrojado por Renaper tiene un bajo grado de precision, por favor inténte sacar mejores fotos."
		},
		SCAN_BAR_CODE: {
			code: "SCAN_BAR_CODE",
			message: "Hubo un error al enviar el código de barras, por favor inténtelo de nuevo más tarde."
		},
		NEW_OPERATION: {
			code: "NEW_OPERATION",
			message: "Hubo un error al iniciar el tramite de validacion, por favor inténtelo de nuevo más tarde."
		},
		ADD_FRONT: {
			code: "ADD_FRONT",
			message: "Hubo un error al enviar la foto del frente, por favor inténtelo de nuevo más tarde."
		},
		ADD_BACK: {
			code: "ADD_BACK",
			message: "Hubo un error al enviar la foto del dorso, por favor inténtelo de nuevo más tarde."
		},
		ADD_SELFIE: {
			code: "ADD_SELFIE",
			message: "Hubo un error al enviar la selfie, por favor inténtelo de nuevo más tarde."
		},
		ADD_BAR_CODE: {
			code: "ADD_BAR_CODE",
			message: "Hubo un error al analizar el código de barras, por favor inténtelo de nuevo más tarde."
		},
		END_OPERATION: {
			code: "END_OPERATION",
			message: "Hubo un error al analizar los datos, por favor inténtelo de nuevo más tarde."
		}
	},
	SEMILLAS: {
		SUCCESS: {
			SHARE_DATA: "Tus datos fueron compartidos de forma correcta!",
			VALIDATE_DNI: "La solicitud de validación de DNI se registró correctamente."
		}
	},
	SMS: {
		SENT: "Message sent",
		SENDING: function (number) {
			return "Enviando sms a " + number;
		},
		VALIDATION: {
			MESSAGE: code => {
				return `${code} Ingresá este código en la app ai·di para darte de alta.`;
			}
		},
		SUCCESS: {
			SENT: {},
			MATCHED: function (cert) {
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
			SMS_SEND_ERROR: {
				code: "SMS_SEND_ERROR",
				message: "No pudo mandarse el sms, por favor inténtelo de nuevo más tarde."
			},
			ALREADY_EXISTS: {
				code: "ALREADY_EXISTS",
				message: "Ese teléfono ya se encuentra asociado a un usuario, por favor elija otro."
			},
			VALIDATION_EXPIRED: {
				code: "VALIDATION_EXPIRED",
				message:
					"El pedido de validacion para ese número ha expirado, es necesario realizar un nuevo pedido de validacion."
			},
			NO_VALIDATIONS_FOR_NUMBER: {
				code: "NO_VALIDATIONS",
				message: "No se encontraron pedidos de validación para ese número."
			},
			NO_SMSCODE_MATCH: {
				code: "NO_SMSCODE_MATCH",
				message:
					"El código de validacion es incorrecto, por favor verifique sus mensajes, un sms con el codigo de validacion deberia encontrarse alli."
			},
			CREATE: {
				code: "VALIDATION_CREATE",
				message: "El pedido de validacion para ese número no pudo ser creado, por favor inténtelo de nuevo más tarde."
			},
			GET: COMMUNICATION_ERROR
		}
	},
	TOKEN: {
		INVALID: () => "El token es invalido, por favor verificarlo o loguearse para obtener uno nuevo.",
		EXPIRED: () => "El token ha expirado, es necesario volver a loguearse.",
		EXPIRED_CODE: () => ({
			message: "El token ha expirado.",
			code: "EXPIRED_TOKEN"
		}),
		INVALID_CODE: isUser => ({
			message: `El token de ${isUser ? "usuario" : "aplicación"} es inválido, por favor verificalo.`,
			code: "INVALID_TOKEN"
		})
	},
	IMAGE: {
		ERR: {
			INVALID_SIZE: {
				code: "INVALID_SIZE",
				message: "El tamaño de la imagen supera el limite permitido de 3 MB."
			},
			GET: {
				code: "IMAGE_GET",
				message: "No se pudo obtener la imagen, por favor inténtelo de nuevo más tarde."
			},
			CREATE: {
				code: "IMAGE_CREATE",
				message: "Hubo un error al durante la creación  de la imagen, por favor inténtelo de nuevo más tarde."
			}
		}
	},
	USER: {
		SUCCESS: {
			LOGGED_IN: {},
			REGISTERED: {},
			CHANGED_PASS: {},
			CHANGED_PHONE: function (cert) {
				return { certificate: cert };
			},
			CHANGED_EMAIL: function (cert) {
				return { certificate: cert };
			}
		},
		ERR: {
			INVALID_LOGIN: {
				code: "INVALID_LOGIN",
				message:
					"No se encontró ese usuario: email o contraseña incorrecta. (si no recuerda su contraseña, vaya atrás y haga click en recuperar cuenta > No recuerdo la contraseña)"
			},
			VALIDATE_DID_ERROR: {
				code: "VALIDATE_DID_ERROR",
				message: "Ese did no se encuentra autorizado a realizar esa operacion."
			},
			USER_ALREADY_EXIST: {
				code: "USER_ALREADY_EXIST",
				message:
					"Ese did ya se encuentra asociado a un usuario, si desea utilizar una cuenta ya existente, por favor dirigirse a 'Recuperar Cuenta'."
			},
			INVALID_USER: {
				code: "INVALID_USER",
				message:
					"El usuario y contraseña no coinciden, por favor, verifique los valores antes de intentarlo nuevamente."
			},
			INVALID_USER_DID: {
				code: "INVALID_USER_DID",
				message: "El usuario fue generado desde otro teléfono, es necesario recuperar la cuenta para loguearse."
			},
			INVALID_USER_EMAIL: {
				code: "INVALID_USER_EMAIL",
				message:
					"El mail ingresado no corresponde a ese usuario, por favor verifique que sea correcto antes de volver a intentarlo."
			},
			NOMATCH_USER_DID: {
				code: "NOMATCH_USER_DID",
				message:
					"No se encontró ningún usuario con ese did, por favor verifique que sea correcto antes de volver a intentarlo."
			},
			NOMATCH_USER_EMAIL: {
				code: "NOMATCH_USER_EMAIL",
				message:
					"No se encontró ningún usuario con ese mail y contraseña, por favor, verifique los valores antes de intentarlo nuevamente."
			},
			MAIL_NOT_VALIDATED: {
				code: "MAIL_NOT_VALIDATED",
				message:
					"Ese mail no fue validado, en caso de no haber terminado el proceso, por favor verifique su direccion de correo, un mail con el codigo de validacion deberia encontrarse alli."
			},
			PHONE_NOT_VALIDATED: {
				code: "PHONE_NOT_VALIDATED",
				message:
					"Ese teléfono no fue validado, en caso de no haber terminado el proceso, por favor verifique sus mensajes, un sms con el codigo de validacion deberia encontrarse alli."
			},
			VALIDATE: {
				code: "VALIDATE",
				message: "Error al validar informacion de usuario, por favor inténtelo de nuevo más tarde."
			},
			EMAIL_TAKEN: { code: "EMAIL_TAKEN", message: "Ese mail ya se encuentra en uso, por favor elija otro." },
			TEL_TAKEN: { code: "TEL_TAKEN", message: "Ese teléfono ya se encuentra en uso, por favor elija otro." },
			CREATE: {
				code: "USER_CREATE",
				message: "Hubo un error al durante la creación  del usuario, por favor inténtelo de nuevo más tarde."
			},
			GET: { code: "USER_GET", message: "No se pudo obtener el usuario, por favor inténtelo de nuevo más tarde." },
			UPDATE: {
				code: "USER_UPDATE",
				message: "No se pudo actualizar el usuario, por favor inténtelo de nuevo más tarde."
			}
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
		DOES_NOT_EXIST: function (type) {
			return { code: "PARAMETER_MISSING", message: "falta el campo: " + type };
		},
		MOVILE_PHONE_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un número telefónico"
			};
		},
		EMAIL_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un mail"
			};
		},
		IP_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba una direccion ip"
			};
		},
		STRING_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un texto"
			};
		},
		NUMBER_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un número"
			};
		},
		BOOLEAN_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un booleano ('true' o 'false')"
			};
		},
		BASE64_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un texto en base 64"
			};
		},
		DNI_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba una dni"
			};
		},
		DATE_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message:
					"El campo " +
					field +
					" es incorrecto, se esperaba una fecha con el siguiente formato: 'aaaa-mm-ddThh:mm:ssZ.' "
			};
		},
		LENGTH_INVALID: function (field, min, max) {
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
		},
		APP_DID_NOT_FOUND: did => ({
			code: "APP_DID_NOT_FOUND",
			message: `La Aplicación con el DID ${did} no esta autorizada.`
		}),
		ADMIN_DID_NOT_MATCH: did => ({
			code: "ADMIN_DID_NOT_MATCH",
			message: `El DID ${did} provisto no coincide con ningún admin.`
		}),
		DID_NOT_FOUND: did => ({
			code: "DID_NOT_FOUND",
			message: `El usuario con el DID ${did} no existe.`
		})
	},
	USER_APP: {
		NOT_FOUND: did => ({
			code: "USER_APP_NOT_FOUND",
			message: `El usuario con el DID ${did} no existe o no tiene cuenta en una aplicación autorizada.`
		})
	}
};
