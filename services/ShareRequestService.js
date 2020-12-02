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
