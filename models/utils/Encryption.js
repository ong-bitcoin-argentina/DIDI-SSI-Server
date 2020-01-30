const NodeRSA = require("node-rsa");
const Constants = require("../../constants/Constants");
const key = new NodeRSA(Constants.RSA_PRIVATE_KEY);

class Encrypt {
	static async encrypt(data) {
		const encrypted = key.encrypt(data, "base64");
		return encrypted;
	}

	static async decript(encrypted) {
		const data = key.decrypt(encrypted, "utf8");
		return data;
	}
}

module.exports = Encrypt;
