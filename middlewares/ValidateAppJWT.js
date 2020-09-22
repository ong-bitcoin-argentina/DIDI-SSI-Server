const { decodeJWT } = require("did-jwt");
const AppAuthService = require("../services/AppAuthService");
const {
	VALIDATION: { APP_DID_NOT_FOUND }
} = require("../constants/Messages");

module.exports = async (req, res, next) => {
	const { payload } = decodeJWT(req.header("Authorization"));
	const did = payload.iss;
	const authorizatedApp = AppAuthService.findByDID(did);
	if (!authorizatedApp) {
		throw APP_DID_NOT_FOUND(did);
	}
	next();
};
