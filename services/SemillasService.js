const { SEMILLAS_URLS, SEMILLAS_LOGIN } = require("../constants/Constants");
const fetch = require("node-fetch");
const { postOptions, postOptionsAuth, getOptionsAuth } = require("../constants/RequestOptions");
const SemillasAuth = require("../models/SemillasAuth");

const semillasFetch = async function (url, data) {
	let token = await SemillasAuth.getToken();
	let options = data ? postOptionsAuth : getOptionsAuth;
	let res = await fetch(url, options(token, data));
	// retry because semillas deletes the token when it's login in from another side
	if (res.status === 401) {
		token = await SemillasAuth.createOrUpdateToken();
		res = await fetch(url, options(token, data));
	}
	return res;
};

const handleJsonResponse = async res => {
	const content = await res.json();
	if (!res.ok) {
		throw {
			message: content.userMessage
		};
	}
	return content;
};

const handleTextResponse = async res => {
	const content = await res.text();
	if (!res.ok) {
		throw new Error(content);
	}
	return content;
};

module.exports.login = async function () {
	const res = await fetch(SEMILLAS_URLS.LOGIN, postOptions(SEMILLAS_LOGIN));
	return await res.json();
};

module.exports.sendDIDandDNI = async function ({ dni, did }) {
	const data = { dni, did };
	const res = await semillasFetch(SEMILLAS_URLS.CREDENTIALS_DIDI, data);
	return await res.json();
};

module.exports.validateDni = async function (data) {
	const res = await semillasFetch(SEMILLAS_URLS.VALIDATE_DNI, data);
	return await handleTextResponse(res);
};

module.exports.shareData = async function (data) {
	const res = await semillasFetch(SEMILLAS_URLS.SHARE_DATA, data);
	return await handleJsonResponse(res);
};

module.exports.getPrestadores = async function (token) {
	const res = await semillasFetch(SEMILLAS_URLS.PRESTADORES);
	return await res.json();
};
