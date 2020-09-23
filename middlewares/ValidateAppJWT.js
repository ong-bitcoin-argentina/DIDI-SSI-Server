const AppAuthService = require("../services/AppAuthService");
const { getPayload, verifyToken } = require("../services/TokenService");
const {
	VALIDATION: { APP_DID_NOT_FOUND },
	TOKEN: { INVALID_CODE }
} = require("../constants/Messages");

module.exports = async (req, res, next) => {
	const jwt = req.header("Authorization");
	const verified = await verifyToken(jwt);
	if (verified.payload) {
		const did = verified.payload.iss;
		const authorizatedApp = AppAuthService.findByDID(did);
		if (!authorizatedApp) throw APP_DID_NOT_FOUND(did);
		next();
	} else {
		throw INVALID_CODE();
	}
};
