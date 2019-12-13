const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const CertificateService = require("../services/CertificateService");
const UserService = require("../services/UserService");
const RenaperService = require("../services/RenaperService");
const AuthRequestService = require("../services/AuthRequestService");

const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

// var jwt = require("jsonwebtoken");

router.post(
	"/renaper/validateDni",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },

		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },

		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "lastName", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "birthDate", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "order", validate: [Constants.VALIDATION_TYPES.IS_STRING] },

		{ name: "selfieImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "frontImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "backImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;

		const dni = req.body.dni;
		const gender = req.body.gender;
		const name = req.body.name;
		const lastName = req.body.lastName;
		const birthDate = req.body.birthDate;
		const order = req.body.order;

		const selfieImage = req.body.selfieImage;
		const frontImage = req.body.frontImage;
		const backImage = req.body.backImage;

		const fingerPrintData = Constants.FINGER_PRINT_DATA;
		const deviceIp = Constants.SERVER_IP;
		const analyzeAnomalies = Constants.RENAPER_ANALYZE_ANOMALIES;
		const analyzeOcr = Constants.RENAPER_ANALYZE_OCR;

		let user, operationId, authRequest;
		try {
			//const didData = jwt.decode(certDID);
			//const did = didData.iss;

			// obtener usuario
			user = await UserService.getByDID(did);

			// iniciar pedido de validacion de identidad con el renaper
			operationId = await RenaperService.newOpperation(dni, gender, deviceIp, fingerPrintData);

			// guardar estado como "en progreso y retornar"
			authRequest = await AuthRequestService.create(operationId, did);
		} catch (err) {
			console.log(err);
			return ResponseHandler.suploadFileendErr(res, err);
		}

		ResponseHandler.sendRes(res, { status: authRequest.status, operationId: authRequest.operationId });

		try {
			// agregar frente del dni al pedido
			await RenaperService.addFront(dni, gender, operationId, frontImage, analyzeAnomalies, analyzeOcr);

			// agregar dorso del dni al pedido
			await RenaperService.addBack(dni, gender, operationId, backImage, analyzeAnomalies, analyzeOcr);

			// agregar selfie al pedido
			await RenaperService.addSelfie(dni, gender, operationId, selfieImage);

			// agregar codigo de barras al pedido
			await RenaperService.addBarcode(dni, gender, operationId, name, lastName, birthDate, order);

			// ejecutar pedido
			const userData = await RenaperService.endOperation(dni, gender, operationId);

			// si no hubo match o no se obtuvo la precision buscada pasar a estado "fallido"
			if (!userData || !userData.confidence || userData.confidence < Constants.RENAPER_SCORE_TRESHOULD) {
				await authRequest.update(Constants.AUTHENTICATION_REQUEST.FALIED, Messages.RENAPER.WEAK_MATCH.message);
				return;
			}

			// generar certificados con esa info
			const data = {
				dni: dni,
				names: userData.ocr.names,
				lastNames: userData.ocr.lastNames,
				gender: userData.ocr.gender,
				birthdate: userData.ocr.birthdate
			};
			const additional = JSON.parse(userData.ocr.extra.additional);

			// delete empty fields
			var propNames = Object.getOwnPropertyNames(additional);
			for (var i = 0; i < propNames.length; i++) {
				var propName = propNames[i];
				if (!additional[propName]) delete additional[propName];
			}

			const generateCert = CertificateService.createCertificate(
				did,
				{ identidad: { preview: { fields: ["dni", "names", "lastNames", "gender"], type: 1 }, data: data } },
				additional.ExpiryDate,
				Messages.CERTIFICATE.ERR.CREATE
			);

			const generateAditionalCert = CertificateService.createCertificate(
				did,
				{ "identidad (adicionales): ": { preview: { fields: ["Address", "Nationality"], type: 0 }, data: additional } },
				additional.ExpiryDate,
				Messages.CERTIFICATE.ERR.CREATE
			);

			const [cert, aditionalCert] = await Promise.all([generateCert, generateAditionalCert]);

			// enviar certificados a mouro para ser guardado
			const saveCert = CertificateService.saveCertificate(cert, did);
			const saveAditionalCert = CertificateService.saveCertificate(aditionalCert, did);
			const [resCert, resAditionalCert] = await Promise.all([saveCert, saveAditionalCert]);

			// agregar info de renaper al usuario
			const addCert = UserService.addJWT(user, resCert);
			const addAditionalCert = UserService.addJWT(user, resAditionalCert);
			await Promise.all([addCert, addAditionalCert]);
			await authRequest.update(Constants.AUTHENTICATION_REQUEST.SUCCESSFUL);
			return;
		} catch (err) {
			console.log(err);
			await authRequest.update(Constants.AUTHENTICATION_REQUEST.FALIED, err.message);
			return;
		}
	}
);

router.get(
	"/renaper/validateDni",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "operationId", validate: [Constants.VALIDATION_TYPES.IS_STRING] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const operationId = req.body.operationId;

		try {
			//const didData = jwt.decode(certDID);
			//const did = didData.iss;

			const authRequest = await AuthRequestService.getByOperationId(operationId);
			return ResponseHandler.sendRes(res, {
				status: authRequest.status,
				operationId: authRequest.operationId,
				message: authRequest.errorMessage
			});
		} catch (err) {
			console.log(err);
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
