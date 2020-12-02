const Messages = require("../constants/Messages");
const { getPayload } = require("./TokenService");
const ShareRequest = require("../models/ShareRequest");

module.exports.saveShareRequest = async function ({ jwt }) {
	try {
		const { aud, iss } = getPayload(jwt);
		return await ShareRequest.generate({ aud, iss, jwt });
	} catch (e) {
		throw Messages.SHAREREQUEST.ERR.CREATE;
	}
};

module.exports.getShareRequestById = async function ({ id }) {
	try {
		const shareRequest = await ShareRequest.getById(id);

		// Verifico si existe el share request
		if (!shareRequest) throw Messages.SHAREREQUEST.ERR.NOT_FOUND;

		// Verifico si el aud es el correcto con el token (FALTA)
		const { aud, jwt } = shareRequest;

		// Borro el share request
		await shareRequest.remove();

		return jwt;
	} catch (e) {
		console.log(e);
		throw Messages.SHAREREQUEST.ERR.GET;
	}
};
