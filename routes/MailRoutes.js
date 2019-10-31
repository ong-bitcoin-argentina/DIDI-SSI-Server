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
	function(req, res) {
		const eMail = req.body.eMail;
		const did = req.body.did;

		let code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
		if (Constants.DEBUGG) console.log(code);

		return MailService.create(
			eMail,
			code,
			did,
			function(_) {
				MailService.sendValidationCode(
					eMail,
					code,
					function(_) {
						return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
					},
					function(err) {
						return ResponseHandler.sendErr(res, err);
					}
				);
			},
			function(err) {
				return ResponseHandler.sendErr(res, err);
			}
		);
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
	function(req, res) {
		const validationCode = req.body.validationCode;
		const did = req.body.did;

		return MailService.validateMail(
			did,
			validationCode,
			function(mail) {
				const subject = {
					emailCredential: {
						email: mail.email
					}
				};
				CertificateService.createCertificate(
					did,
					subject,
					function(certificate) {
						return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.MATCHED(certificate));
					},
					function(err) {
						return ResponseHandler.sendErr(res, err);
					}
				);
			},
			function(err) {
				return ResponseHandler.sendErr(res, err);
			}
		);
	}
);

module.exports = router;
