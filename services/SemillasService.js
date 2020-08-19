const { SEMILLAS_URLS, SEMILLAS_LOGIN } = require("../constants/Constants");
const fetch = require("node-fetch");
const { postOptions, postOptionsAuth, getOptionsAuth } = require("../constants/RequestOptions");
const SemillasAuth = require("../models/SemillasAuth");

// const prestadores = require("../constants/MockPrestadores");

const semillasFetch = async function (url, data) {
	let token = await SemillasAuth.getToken();
	let options = data ? postOptionsAuth : getOptionsAuth;
	let res = await fetch(url, options(token, data));
	// retry because semillas deletes the token when it login in from another side
	if (res.status === 401) {
		token = await SemillasAuth.createOrUpdateToken();
		res = await fetch(url, options(token, data));
	}
	return res;
};

module.exports.login = async function () {
	const { username, password } = SEMILLAS_LOGIN;
	const data = { username, password };
	const res = await fetch(SEMILLAS_URLS.LOGIN, postOptions(data));
	return await res.json();
};

module.exports.sendDIDandDNI = async function ({ dni, did }) {
	const data = { dni, did };
	const res = await semillasFetch(SEMILLAS_URLS.CREDENTIALS_DIDI, data);
	const didi = await res.json();
	return didi;
};

module.exports.validateDni = async function (data) {
	// const res = await semillasFetch(SEMILLAS_URLS.VALIDATE_DNI, data);
	// return await res.json();
	return data;
};

module.exports.shareData = async function (data) {
	const res = await semillasFetch(SEMILLAS_URLS.SHARE_EMAIL, data);
	return await res.json();
};

module.exports.getPrestadores = async function (token) {
	const res = await semillasFetch(SEMILLAS_URLS.PRESTADORES);
	return await res.json();
};
