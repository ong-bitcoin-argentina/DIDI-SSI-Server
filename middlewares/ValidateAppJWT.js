const AppAuthService = require("../services/AppAuthService");
const { verifyToken, getPayload } = require("../services/TokenService");
const {
	VALIDATION: { APP_DID_NOT_FOUND },
	TOKEN: { INVALID_CODE }
} = require("../constants/Messages");

module.exports.ValidateAppJWT = async (req, res, next) => {
	const jwt = req.header("Authorization");
	const did = getPayload(jwt).iss;
	const authorizatedApp = AppAuthService.findByDID(did);
	if (!authorizatedApp) throw APP_DID_NOT_FOUND(did);

	const verified = await verifyToken(jwt);
	if (!verified.payload) throw INVALID_CODE();
	next();
};
