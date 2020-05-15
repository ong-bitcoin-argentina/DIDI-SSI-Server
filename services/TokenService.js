const Messages = require("../constants/Messages");
const { decodeJWT } = require("did-jwt");

const jwt = require("jsonwebtoken");

// validates the token and returns userId
module.exports.getTokenData = async function (token) {
	try {
		const decoded = await decodeJWT(token);
		if (!decoded) {
			return Promise.reject(Messages.TOKEN.INVALID());
		}

		return Promise.resolve(decoded);
	} catch (err) {
		console.log(err);

		if (err.name == "TokenExpiredError") {
			return Promise.reject(Messages.TOKEN.EXPIRED());
		}
		if (err.name == "JsonWebTokenError") {
			return Promise.reject(Messages.TOKEN.INVALID());
		}
		return Promise.reject({ name: err.name, message: err.message });
	}
};
