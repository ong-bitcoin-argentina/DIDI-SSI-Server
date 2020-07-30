const { SEMILLAS_URLS, SEMILLAS_LOGIN } = require("../constants/Constants");
const fetch = require("node-fetch");
const { postOptions, postOptionsAuth, getOptionsAuth } = require("../constants/RequestOptions");
const SemillasAuth = require("../models/SemillasAuth");

const prestadores = require("../constants/MockPrestadores");

const semillasFetch = async function (url, data) {
	try {
		let token = await SemillasAuth.getToken();
		let options = data ? postOptionsAuth : getOptionsAuth;
		let res = await fetch(url, options(token, data));
		// retry because semillas deletes the token when it login in from another side
		if (res.status === 401) {
			token = await SemillasAuth.createOrUpdateToken();
			res = await fetch(url, options(token, data));
		}
		return res;
	} catch (err) {
		throw err;
	}
};

module.exports.login = async function () {
	try {
		const { username, password } = SEMILLAS_LOGIN;
		const data = { username, password };
		const res = await fetch(SEMILLAS_URLS.LOGIN, postOptions(data));
		const json = await res.json();
		return json;
	} catch (err) {
		throw err;
	}
};

module.exports.sendDIDandDNI = async function ({ dni, did }) {
	try {
		const data = { dni, did };
		const res = await semillasFetch(SEMILLAS_URLS.CREDENTIALS_DIDI, data);
		const didi = await res.json();
		return didi;
	} catch (err) {
		throw err;
	}
};

module.exports.shareEmail = async function ({ email }) {
	try {
		const data = { email };
		// const res = await semillasFetch(SEMILLAS_URLS.SHARE_EMAIL, data);
		// const json = await res.json();
		return data;
	} catch (err) {
		throw err;
	}
};

module.exports.getPrestadores = async function (token) {
	try {
		// const res = await semillasFetch(SEMILLAS_URLS.PRESTADORES);
		// const json = await res.json();
		return prestadores;
	} catch (err) {
		throw err;
	}
};
