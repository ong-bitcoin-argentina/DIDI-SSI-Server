const ResponseHandler = require("../routes/utils/ResponseHandler");
const { verifyToken, getPayload } = require("../services/TokenService");
const {
	VALIDATION: { ADMIN_DID_NOT_MATCH },
	TOKEN: { INVALID_CODE }
} = require("../constants/Messages");
const Admin = require("../models/Admin");

const handleValidateAdminJWT = async (req, res) => {
	const jwt = req.header("Authorization");
	const did = getPayload(jwt).iss;

	const admin = await Admin.getByDID(did);
	if(!admin) throw ADMIN_DID_NOT_MATCH(did);

	const verified = await verifyToken(jwt);
	if (!verified.payload) throw INVALID_CODE();
};

const validateAdminJWT = async (req, res, next) => {
	try {
		await handleValidateAdminJWT(req);
		next();
	} catch (err) {
		return ResponseHandler.sendErrWithStatus(res, err, 400);
	}
};

module.exports = {
	validateAdminJWT
};
