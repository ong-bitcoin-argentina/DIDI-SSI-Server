const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const jwt = require("jsonwebtoken");

// validates the token and returns userId
module.exports.getTokenData = async function (token, did) {
	try {
		var decoded = jwt.verify(token, did);

		if (!decoded || !decoded[fieldName]) {
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
