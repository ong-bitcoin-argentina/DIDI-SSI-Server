const { handleValidateAppJWT } = require("./ValidateAppJWT");
const { verifyCertificate } = require("../services/CertService");
const {
	TOKEN: { INVALID_CODE }
} = require("../constants/Messages");

const validateAppOrUserJWT = async (req, res, next) => {
	const { userJWT } = req.body;
	if (!userJWT) {
		await handleValidateAppJWT(req);
		return next();
	}
	const userVerified = await verifyCertificate(userJWT);
	if (!userVerified.payload) throw INVALID_CODE(true);
	next();
};

module.exports = {
	validateAppOrUserJWT
};
