const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const CertificateService = require("../services/CertificateService");
const UserService = require("../services/UserService");
const RenaperService = require("../services/RenaperService");

const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

var jwt = require("jsonwebtoken");

/*
router.post(
	"/renaper/newOperation",
	Validator.validateBody([
		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },
		{ name: "deviceIp", validate: [Constants.VALIDATION_TYPES.IS_IP] },
		{ name: "fingerPrintData", validate: [Constants.VALIDATION_TYPES.IS_FINGER_PRINT] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const dni = req.body.dni;
		const gender = req.body.gender;
		const deviceIp = req.body.deviceIp;
		const fingerPrintData = req.body.fingerPrintData;

		try {
			const result = await RenaperService.newOpperation(dni, gender, deviceIp, fingerPrintData);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/renaper/scanBarcode",
	Validator.validateBody([{ name: "image", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] }]),
	Validator.checkValidationResult,
	async function(req, res) {
		const image = req.body.image;

		try {
			const result = await RenaperService.scanBarcode(image);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/renaper/addFront",
	Validator.validateBody([
		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },
		{ name: "operationId", validate: [Constants.VALIDATION_TYPES.IS_NUMBER] },
		{ name: "frontImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "analyzeAnomalies", validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN] },
		{ name: "analyzeOcr", validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const dni = req.body.dni;
		const gender = req.body.gender;
		const operationId = req.body.operationId;
		const frontImage = req.body.frontImage;
		const analyzeAnomalies = req.body.analyzeAnomalies;
		const analyzeOcr = req.body.analyzeOcr;

		try {
			const result = await RenaperService.addFront(dni, gender, operationId, frontImage, analyzeAnomalies, analyzeOcr);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/renaper/addBack",
	Validator.validateBody([
		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },
		{ name: "operationId", validate: [Constants.VALIDATION_TYPES.IS_NUMBER] },
		{ name: "backImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "analyzeAnomalies", validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN] },
		{ name: "analyzeOcr", validate: [Constants.VALIDATION_TYPES.IS_BOOLEAN] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const dni = req.body.dni;
		const gender = req.body.gender;
		const operationId = req.body.operationId;
		const backImage = req.body.backImage;
		const analyzeAnomalies = req.body.analyzeAnomalies;
		const analyzeOcr = req.body.analyzeOcr;

		try {
			const result = await RenaperService.addBack(dni, gender, operationId, backImage, analyzeAnomalies, analyzeOcr);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/renaper/addSelfie",
	Validator.validateBody([
		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },
		{ name: "operationId", validate: [Constants.VALIDATION_TYPES.IS_NUMBER] },
		{ name: "selfieImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const dni = req.body.dni;
		const gender = req.body.gender;
		const operationId = req.body.operationId;
		const selfieImage = req.body.selfieImage;

		try {
			const result = await RenaperService.addSelfie(dni, gender, operationId, selfieImage);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/addBarCode",
	Validator.validateBody([
		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },
		{ name: "operationId", validate: [Constants.VALIDATION_TYPES.IS_NUMBER] },
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "lastName", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "birthDate", validate: [Constants.VALIDATION_TYPES.IS_DATE_TIME] },
		{ name: "order", validate: [Constants.VALIDATION_TYPES.IS_STRING] }		
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const dni = req.body.dni;
		const gender = req.body.gender;
		const operationId = req.body.operationId;
		const name = req.body.name;
		const lastName = req.body.lastName;
		const birthDate = req.body.birthDate;
		const order = req.body.order;

		try {
			const result = await RenaperService.addBarcode(dni, gender, operationId, name, lastName, birthDate, order);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/renaper/endOperation",
	Validator.validateBody([
		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },
		{ name: "operationId", validate: [Constants.VALIDATION_TYPES.IS_NUMBER] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const dni = req.body.dni;
		const gender = req.body.gender;
		const operationId = req.body.operationId;

		try {
			const result = await RenaperService.endOperation(dni, gender, operationId);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);
*/
router.post(
	"/renaper/validateDni",
	Validator.validateBody([
		{ name: "did", validate: [Constants.VALIDATION_TYPES.IS_STRING] },

		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },

		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "lastName", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "birthDate", validate: [Constants.VALIDATION_TYPES.IS_DATE_TIME] },
		{ name: "order", validate: [Constants.VALIDATION_TYPES.IS_STRING] },

		{ name: "selfieImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "frontImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "backImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const certDID = req.body.did;

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

		try {
			const didData = jwt.decode(certDID);
			const did = didData.iss;

			// obtener usuario
			const user = UserService.getByDID(did);

			// obtener info del usuario de renaper
			console.log("newOpperation");
			const operationId = await RenaperService.newOpperation(dni, gender, deviceIp, fingerPrintData);
			console.log("addFront");
			await RenaperService.addFront(dni, gender, operationId, frontImage, analyzeAnomalies, analyzeOcr);
			console.log("addBack");
			await RenaperService.addBack(dni, gender, operationId, backImage, analyzeAnomalies, analyzeOcr);
			console.log("addSelfie");
			await RenaperService.addSelfie(dni, gender, operationId, selfieImage);
			console.log("addBarcode");
			await RenaperService.addBarcode(dni, gender, operationId, name, lastName, birthDate, order);
			console.log("endOperation");
			const userData = await RenaperService.endOperation(dni, gender, operationId);

			if (userData.confidence > Constants.RENAPER_SCORE_TRESHOULD) return ResponseHandler.sendRes(res, userData);

			// generar certificados con esa info
			const data = {
				dni: dni,
				names: userData.ocr.names,
				lastNames: userData.ocr.lastNames,
				gender: userData.ocr.gender,
				birthdate: new Date(userData.ocr.birthdate)
			};
			const aditionalData = userData.ocr.extra.aditional;

			const generateCert = CertificateService.createCertificate(
				did,
				data,
				aditionalData.ExpiryDate,
				Messages.CERTIFICATE.ERR.CREATE
			);
			const generateAditionalCert = CertificateService.createCertificate(
				did,
				aditionalData,
				aditionalData.ExpiryDate,
				Messages.CERTIFICATE.ERR.CREATE
			);
			const [resCert, resAditionalCert] = await Promise.all([generateCert, generateAditionalCert]);

			// agregar info de renaper al usuario
			const addCert = UserService.addJwt(user, resCert);
			const addAditionalCert = UserService.addJwt(user, resAditionalCert);

			// enviar certificados a mouro para ser guardado
			const saveCert = MouroService.saveCertificate(resCert, did);
			const saveAditionalCert = MouroService.saveCertificate(resAditionalCert, did);

			const result = await Promise.all([addCert, addAditionalCert, saveCert, saveAditionalCert]);
			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
