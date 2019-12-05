const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const renaperPost = async function(url, body) {
	try {
		var response = await fetch(Constants.RENAPER_API, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: Constants.RENAPER_API_KEY,
				url: url
			},
			body: body
		});

		const jsonResp = await response.json();
		return jsonResp.status === "error" ? Promise.reject(jsonResp) : Promise.resolve(jsonResp);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

module.exports.scanBarcode = async function(file) {
	try {
		var result = await renaperPost(
			Constants.RENAPER_URLS.SCAN_BAR_CODE,
			JSON.stringify({
				file: file
			})
		);
		return Promise.resolve(result.data);
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports.newOpperation = async function(dni, gender, deviceIp, fingerprintData) {
	try {
		var result = await renaperPost(
			Constants.RENAPER_URLS.NEW_OPERATION,
			JSON.stringify({
				number: dni,
				gender: gender,
				ipAddress: deviceIp,
				applicationVersion: Constants.RENAPER_APP_VERS,
				browserFingerprintData: fingerprintData
			})
		);
		return Promise.resolve(result.operationId);
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports.addFront = async function(dni, gender, operationId, frontImage, analyzeAnomalies, analyzeOcr) {
	try {
		var result = await renaperPost(
			Constants.RENAPER_URLS.ADD_FRONT,
			JSON.stringify({
				number: dni,
				gender: gender,
				operationId: operationId,
				file: frontImage,
				analyzeAnomalies: analyzeAnomalies,
				analyzeOcr: analyzeOcr
			})
		);
		return Promise.resolve(result);
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports.addBack = async function(dni, gender, operationId, backImage, analyzeAnomalies, analyzeOcr) {
	try {
		var result = await renaperPost(
			Constants.RENAPER_URLS.ADD_BACK,
			JSON.stringify({
				number: dni,
				gender: gender,
				operationId: operationId,
				file: backImage,
				analyzeAnomalies: analyzeAnomalies,
				analyzeOcr: analyzeOcr
			})
		);
		return Promise.resolve(result);
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports.addSelfie = async function(dni, gender, operationId, selfie) {
	try {
		var result = await renaperPost(
			Constants.RENAPER_URLS.ADD_SELFIE,
			JSON.stringify({
				number: dni,
				gender: gender,
				operationId: operationId,
				selfieList: [{ file: selfie, imageType: "SN" }]
			})
		);
		return Promise.resolve(result);
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports.addBarcode = async function(dni, gender, operationId, name, lastName, birthDate) {
	const document = {
		names: name,
		lastNames: lastName,
		number: dni,
		birthdate: birthDate,
		gender: gender,
		order: operationId
	};

	try {
		var result = await renaperPost(
			Constants.RENAPER_URLS.ADD_BAR_CODE,
			JSON.stringify({
				number: dni,
				gender: gender,
				operationId: operationId,
				document: document
			})
		);
		return Promise.resolve(result);
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports.endOperation = async function(dni, gender, operationId) {
	try {
		var result = await renaperPost(
			Constants.RENAPER_URLS.END_OPERATION,
			JSON.stringify({
				number: dni,
				gender: gender,
				operationId: operationId
			})
		);
		return Promise.resolve(result);
	} catch (err) {
		return Promise.reject(err);
	}
};
