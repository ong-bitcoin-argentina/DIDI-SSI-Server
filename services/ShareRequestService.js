const Messages = require("../constants/Messages");
const { getPayload } = require("./TokenService");
const ShareRequest = require("../models/ShareRequest");

const { CREATE, NOT_FOUND, GET, USER_NOT_VALID } = Messages.SHAREREQUEST.ERR;

module.exports.saveShareRequest = async function ({ jwt }) {
	try {
		const { aud, iss } = getPayload(jwt);
		return await ShareRequest.generate({ aud, iss, jwt });
	} catch (e) {
		throw CREATE;
	}
};

module.exports.getShareRequestById = async function ({ id, userJWT }) {
	try {
		const shareRequest = await ShareRequest.getById(id);

		// Verifico si existe el share request
		if (!shareRequest) return Promise.reject(NOT_FOUND);

		// Verifico si el aud es el correcto con el token
		const { iss } = getPayload(userJWT);
		const { aud, jwt } = shareRequest;

		if (iss !== aud) return Promise.reject(USER_NOT_VALID);

		// Borro el share request
		await shareRequest.remove();
		return jwt;
	} catch (e) {
		console.log(e);
		throw GET;
	}
};
