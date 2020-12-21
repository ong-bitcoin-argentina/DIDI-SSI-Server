const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Certificate = require("../models/Certificate");

const MailService = require("../services/MailService");
const UserService = require("../services/UserService");
const MouroService = require("../services/MouroService");
const CertService = require("../services/CertService");

const Validator = require("./utils/Validator");
const CodeGenerator = require("./utils/CodeGenerator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

/**
 *	Validación del email. El usuario debe envia su mail personal para poder
 *	generar una validación a través del envio de un correo electronico.
 *	Si el did ya tiene un usuario asociado, se requiere el ingreso de la contraseña para dicho usuario.
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
			optional: true,
		},
		{ name: "unique", validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN], optional: true },
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const eMail = req.body.eMail.toLowerCase();
		const did = req.body.did;
		const password = req.body.password;

		const unique = req.body.unique;

		try {
			// validar que el mail no este en uso
			if (unique) await UserService.emailTaken(eMail);

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

/**
 *	Reenviar Validación del email. 
 */
router.post(
	"/reSendMailValidator",
	Validator.validateBody([
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] }
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const eMail = req.body.eMail.toLowerCase();

		try {
			const mail = await MailService.getByMail(eMail);

			// mandar mail con còdigo de validacion
			await MailService.sendValidationCode(eMail, mail.code);

			return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Validación del código de 6 digitos enviado por Mail. El usuario debe ingresar
 *	su el código de validacion, el cuàl debe haberse mandado previamènte con "/sendMailValidator".
 */
router.post(
	"/verifyMailCode",
	Validator.validateBody([
		{
			name: "validationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH },
		},
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
	]),
	Validator.checkValidationResult,
	async function (req, res) {
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
			let cert = await CertService.createMailCertificate(did, eMail);
			await CertService.verifyCertificateEmail(cert);

			// revocar certificado anterior
			const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.EMAIL);
			for (let elem of old) {
				elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
				const jwt = await elem.getJwt();
				await MouroService.revokeCertificate(jwt, elem.hash, did);
			}

			// mandar certificado a mouro
			const jwt = await MouroService.saveCertificate(cert, did);

			// validar codigo y actualizar pedido de validacion de mail
			await Certificate.generate(
				Constants.CERTIFICATE_NAMES.EMAIL,
				did,
				Constants.CERTIFICATE_STATUS.UNVERIFIED,
				jwt.data,
				jwt.hash
			);
			mail = await MailService.validateMail(mail, did);
			return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.MATCHED(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
