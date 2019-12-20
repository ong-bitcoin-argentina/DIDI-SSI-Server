const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const MailService = require("../services/MailService");
const UserService = require("../services/UserService");
const CertificateService = require("../services/CertificateService");

const Validator = require("./utils/Validator");
const CodeGenerator = require("./utils/CodeGenerator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

/*
	Validación del email. El usuario debe envia su mail personal para poder
	generar una validación a través del envio de un correo electronico. 
	Si el did ya tiene un usuario asociado, se requiere el ingreso de la contraseña para dicho usuario.
*/
router.post(
	"/sendMailValidator",
	Validator.validateBody([
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING], optional: true },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH },
			optional: true
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const eMail = req.body.eMail.toLowerCase();
		const did = req.body.did;
		const password = req.body.password;

		try {
			// se ingresò contraseña, validarla
			if (did && password) await UserService.getAndValidate(did, password);

			// generar còdigo de validacion
			let code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
			if (Constants.DEBUGG) console.log(code);

			// crear y guardar pedido de validacion de mail
			await MailService.create(eMail, code, undefined);

			// mandar mail con còdigo de validacion
			await MailService.sendValidationCode(eMail, code);

			return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
	Validación del código de 6 digitos enviado por Mail. El usuario debe ingresar
	su el código de validacion, el cuàl debe haberse mandado previamènte con "/sendMailValidator".
*/
router.post(
	"/verifyMailCode",
	Validator.validateBody([
		{
			name: "validationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const validationCode = req.body.validationCode;
		const eMail = req.body.eMail.toLowerCase();
		const did = req.body.did;

		try {
			// validar codigo
			let mail = await MailService.isValid(eMail, validationCode);

			// validar que no existe un usuario con ese mail
			const user = await UserService.getByEmail(eMail);
			if (user) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.ALREADY_EXISTS);

			// generar certificado validando que ese did le corresponde al dueño del mail
			let cert = await CertificateService.createMailCertificate(did, eMail);
			await CertificateService.verifyCertificateEmail(cert);

			// mandar certificado a mouro
			const jwt = await CertificateService.saveCertificate(cert, did);

			// revocar certificado anterior
			const jwts = mail.jwts;
			if(jwts.length > 0) {
				const hash = jwts[jwts.length-1].hash;
				await CertificateService.revokeCertificate(hash, did);
			}

			// validar codigo y actualizar pedido de validacion de mail
			mail = await MailService.validateMail(mail, did, jwt);
			return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.MATCHED(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
