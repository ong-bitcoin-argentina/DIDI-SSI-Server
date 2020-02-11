const NodeRSA = require("node-rsa");
const Constants = require("../../constants/Constants");
const key = new NodeRSA(Constants.RSA_PRIVATE_KEY);

const Hashing = require("./Hashing");

// clase utilitaria para encriptar utilizando el algoritmo "rsa"
class Encrypt {

	// encripta la data usando la clave recibida en "RSA_PRIVATE_KEY" 
	static async encrypt(data) {
		const encrypted = key.encrypt(data, "base64");
		return encrypted;
	}

	// des-encripta la data encriptada usando la clave "RSA_PRIVATE_KEY" 
	static async decript(encrypted) {
		const data = key.decrypt(encrypted, "utf8");
		return data;
	}

	// encripta & hashea la data, guarda el resultado dentro del modelo 
	// si "saltData" es true, se genera un salt, sino se utiliza el global 
	// (esto permite busquedas por estos campos en la base de datos aunque reduce grado de seguridad)
	static async setEncryptedData(model, name, data, saltData) {
		try {
			const encrypted = await Encrypt.encrypt(data);
			const hashData = saltData ? await Hashing.saltedHash(data) : await Hashing.hash(data);

			if (model[name] && model[name].hash === hashData.hash) return Promise.resolve(model);

			const encryptedData = {
				encrypted: encrypted,
				// salt: hashData.salt,
				hash: hashData.hash
			};

			model[name] = encryptedData;
			return Promise.resolve(model);
		} catch (err) {
			console.log(err);
			return Promise.reject(err);
		}
	}

	// desencripta el campo indicado y retorna la data
	static async getEncryptedData(model, name) {
		try {
			const encrypted = model[name].encrypted;
			const data = await Encrypt.decript(encrypted);
			return Promise.resolve(data);
		} catch (err) {
			console.log(err);
			return Promise.reject(err);
		}
	}
}

module.exports = Encrypt;
