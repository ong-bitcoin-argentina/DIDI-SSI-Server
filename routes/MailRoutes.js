const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const MailService = require("../services/MailService");
const CertificateService = require("../services/CertificateService");

const Validator = require("./utils/Validator");
const CodeGenerator = require("./utils/CodeGenerator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

/*
	Validación del email. El usuario debe envia su mail personal para poder
	generar una validación a través del envio de un correo electronico. retorna result =
	SUCCESS, en casi de ser.
*/
router.post(
	"/sendMailValidator",
	Validator.validateBody([
		{ name: "eMail", validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_EMAIL] },
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const eMail = req.body.eMail;
		const did = req.body.did;

		let code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
		if (Constants.DEBUGG) console.log(code);

		try {
			await MailService.create(eMail, code, did);
			await MailService.sendValidationCode(eMail, code);
			return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/*
	Validación del código de 6 digitos enviado por Mail. El usuario debe envia
	su el código de validacion. retorna result = SUCCESS en caso de una validación
	correcta del código.
*/
router.post(
	"/verifyMailCode",
	Validator.validateBody([
		{
			name: "validationCode",
			validate: [Constants.VALIDATION_TYPES.IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const validationCode = req.body.validationCode;
		const did = req.body.did;

		let mail;
		try {
			mail = await MailService.validateMail(did, validationCode);
			if (!mail) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.NO_EMAILCODE_MATCH);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}

		const subject = {
			emailCredential: {
				email: mail.email
			}
		};

		try {
			let cert = await CertificateService.createCertificate(did, subject);
			return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.MATCHED(cert));
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
