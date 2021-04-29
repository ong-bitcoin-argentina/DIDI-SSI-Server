const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const Certificate = require("../models/Certificate");

const MailService = require("../services/MailService");
const UserService = require("../services/UserService");
const MouroService = require("../services/MouroService");
const CertService = require("../services/CertService");

const { validateBody, checkValidationResult } = require("./utils/Validator");
const CodeGenerator = require("./utils/CodeGenerator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const { halfHourLimiter } = require("../policies/RateLimit");

const { IS_STRING, IS_EMAIL, IS_PASSWORD, IS_BOOLEAN } = Constants.VALIDATION_TYPES;

/**
 * @openapi
 * 	 /sendMailValidator:
 *   post:
 *     summary: Validación del email
 *     description: El usuario debe proveer su dirección de email personal para poder
 *	     generar una validación a través del envío de un correo electrónico.
 *	     Si el did ya tiene un usuario asociado, se requiere el ingreso de la contraseña para dicho usuario.
 *     requestBody:
 *       required:
 *         - eMail
 *         - password
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               eMail:
 *                 type: string
 *               did:
 *                 type: string
 *               password:
 *                 type: string
 *               unique:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
	"/sendMailValidator",
	validateBody([
		{ name: "eMail", validate: [IS_STRING, IS_EMAIL] },
		{ name: "did", validate: [IS_STRING], optional: true },
		{
			name: "password",
			validate: [IS_STRING, IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH },
			optional: true
		},
		{ name: "unique", validate: [IS_BOOLEAN], optional: true }
	]),
	checkValidationResult,
	halfHourLimiter,
	async function (req, res) {
		const eMail = req.body.eMail.toLowerCase();
		const did = req.body.did;
		const password = req.body.password;

		const unique = req.body.unique;

		try {
			// Validar que el mail no este en uso
			if (unique) await UserService.emailTaken(eMail, did);

			// Si se ingresó contraseña, validarla
			if (did && password) await UserService.getAndValidate(did, password);

			// Generar código de validación
			let code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
			if (Constants.DEBUGG) console.log(code);

			// Crear y guardar pedido de validación de mail
			await MailService.create(eMail, code, undefined);

			// Mandar mail con el código de validación
			await MailService.sendValidationCode(eMail, code);

			return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 * 	 /reSendMailValidator:
 *   post:
 *     summary: Reenviar validación del email
 *     requestBody:
 *       required:
 *         - eMail  
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               eMail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
	"/reSendMailValidator",
	validateBody([{ name: "eMail", validate: [IS_STRING, IS_EMAIL] }]),
	checkValidationResult,
	async function (req, res) {
		const eMail = req.body.eMail.toLowerCase();

		try {
			const mail = await MailService.getByMail(eMail);

			// Mandar mail con código de validación
			await MailService.sendValidationCode(eMail, mail.code);

			return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 * @openapi
 * 	 /verifyMailCode:
 *   post:
 *     summary: Validación del código de 6 digitos enviado por Mail
 *     description: El usuario debe ingresar el código de validacion previamente mandado con "/sendMailValidator".
 *     requestBody:
 *       required:
 *         - validationCode
 *         - eMail
 *         - did
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               validationCode:
 *                 type: string
 *               eMail:
 *                 type: string
 *               did:
 *                 type: string
 *     responses:
 *       200:
 *         description: Puede devolver ok o error en algun parametro
 *       401: 
 *         description: Acción no autorizada
 *       500:
 *         description: Error interno del servidor
 */
router.post(
	"/verifyMailCode",
	validateBody([
		{
			name: "validationCode",
			validate: [IS_STRING],
			length: { min: Constants.RECOVERY_CODE_LENGTH, max: Constants.RECOVERY_CODE_LENGTH }
		},
		{ name: "eMail", validate: [IS_STRING, IS_EMAIL] },
		{ name: "did", validate: [IS_STRING] }
	]),
	checkValidationResult,
	halfHourLimiter,
	async function (req, res) {
		const validationCode = req.body.validationCode;
		const eMail = req.body.eMail.toLowerCase();
		const did = req.body.did;

		try {
			// Validar código
			let mail = await MailService.isValid(eMail, validationCode);

			// Verificar que no exista un usuario con ese mail
			const user = await UserService.getByEmail(eMail);
			if (user) return ResponseHandler.sendErr(res, Messages.EMAIL.ERR.ALREADY_EXISTS);

			// Generar certificado validando que ese did le corresponde al dueño del mail
			let cert = await CertService.createMailCertificate(did, eMail);
			await CertService.verifyCertificateEmail(cert);

			// Revocar certificado anterior
			const old = await Certificate.findByType(did, Constants.CERTIFICATE_NAMES.EMAIL);
			for (let elem of old) {
				elem.update(Constants.CERTIFICATE_STATUS.REVOKED);
				const jwt = await elem.getJwt();
				await MouroService.revokeCertificate(jwt, elem.hash, did);
			}

			// Mandar certificado a mouro
			const jwt = await MouroService.saveCertificate(cert, did);

			// Validar código y actualizar pedido de validación de mail
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
