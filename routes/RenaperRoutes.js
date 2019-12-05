const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const IssuerService = require("../services/IssuerService");
const UserService = require("../services/UserService");
const RenaperService = require("../services/RenaperService");

const Validator = require("./utils/Validator");
const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");

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
		{ name: "birthDate", validate: [Constants.VALIDATION_TYPES.IS_DATE_TIME] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const dni = req.body.dni;
		const gender = req.body.gender;
		const operationId = req.body.operationId;
		const name = req.body.name;
		const lastName = req.body.lastName;
		const birthDate = req.body.birthDate;

		try {
			const result = await RenaperService.addBarcode(dni, gender, operationId, name, lastName, birthDate);
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
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},

		{ name: "dni", validate: [Constants.VALIDATION_TYPES.IS_DNI] },
		{ name: "gender", validate: [Constants.VALIDATION_TYPES.IS_GENDER] },

		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "lastName", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{ name: "birthDate", validate: [Constants.VALIDATION_TYPES.IS_DATE_TIME] },

		{ name: "selfieImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "frontImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },
		{ name: "backImage", validate: [Constants.VALIDATION_TYPES.IS_BASE_64_IMAGE] },

		{ name: "fingerPrintData", validate: [Constants.VALIDATION_TYPES.IS_FINGER_PRINT] }
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const did = req.body.did;
		const password = req.body.password;

		const dni = req.body.dni;
		const gender = req.body.gender;

		const name = req.body.name;
		const lastName = req.body.lastName;
		const birthDate = req.body.birthDate;

		const selfieImage = req.body.selfieImage;

		const frontImage = req.body.frontImage;
		const backImage = req.body.backImage;

		const fingerPrintData = req.body.fingerPrintData;
		const deviceIp = Constants.SERVER_IP;
		const analyzeAnomalies = Constants.RENAPER_ANALYZE_ANOMALIES;
		const analyzeOcr = Constants.RENAPER_ANALYZE_OCR;

		try {
			const user = UserService.getAndValidate(did, password);

			const operationId = await RenaperService.newOpperation(dni, gender, deviceIp, fingerPrintData);
			await RenaperService.addFront(dni, gender, operationId, frontImage, analyzeAnomalies, analyzeOcr);
			await RenaperService.addBack(dni, gender, operationId, backImage, analyzeAnomalies, analyzeOcr);
			await RenaperService.addSelfie(dni, gender, operationId, selfieImage);
			await RenaperService.addBarcode(dni, gender, operationId, name, lastName, birthDate);
			const userData = await RenaperService.endOperation(dni, gender, operationId);

			if (userData.confidence > Constants.RENAPER_SCORE_TRESHOULD) {
				return ResponseHandler.sendRes(res, userData);
			}

			// TODO actualizar info de usuario y emitir certificado
			// UserService.
			// IssuerService.

			return ResponseHandler.sendRes(res, result);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
