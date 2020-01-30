const mongoose = require("mongoose");
const Constants = require("../constants/Constants");
const Hashing = require("./utils/Hashing");
const Encrypt = require("./utils/Encryption");
const EncryptedData = require("./dataTypes/EncryptedData");

const statuses = [
	Constants.CERTIFICATE_STATUS.UNVERIFIED,
	Constants.CERTIFICATE_STATUS.VERIFIED,
	Constants.CERTIFICATE_STATUS.REVOKED
];

const CertificateSchema = new mongoose.Schema({
	userDID: EncryptedData,
	name: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: statuses,
		required: true
	},
	hash: {
		type: String,
		required: true
	},
	jwt: EncryptedData,
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

CertificateSchema.index({ "userDID.encrypted": 1, hash: 1 });

// actualizar estado del certificado
CertificateSchema.methods.update = async function(status) {
	try {
		this.status = status;
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

CertificateSchema.methods.getJwt = async function() {
	return await Encrypt.getEncryptedData(this, "jwt");
};

CertificateSchema.methods.getDid = async function() {
	return await Encrypt.getEncryptedData(this, "userDID");
};

const Certificate = mongoose.model("Certificate", CertificateSchema);
module.exports = Certificate;

Certificate.generate = async function(name, userDID, status, jwt, hash) {
	try {
		const hashData = await Hashing.hash(jwt);
		const didHashData = await Hashing.hash(userDID);

		let certStatus = await Certificate.findOne({
			"userDID.hash": didHashData.hash,
			hash: hash,
			"jwt.hash": hashData.hash
		});
		if (!certStatus) certStatus = new Certificate();
		await Encrypt.setEncryptedData(certStatus, "userDID", userDID);
		certStatus.status = status;
		certStatus.hash = hash;
		certStatus.name = name;
		certStatus.createdOn = new Date();
		await Encrypt.setEncryptedData(certStatus, "jwt", jwt);

		certStatus = await certStatus.save();
		return Promise.resolve(certStatus);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Certificate.findByJwt = async function(jwt) {
	try {
		const hashData = await Hashing.hash(jwt);
		const query = { "jwt.hash": hashData.hash };
		const request = await Certificate.findOne(query);
		return Promise.resolve(request);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Certificate.findByName = async function(did, name) {
	try {
		const didHashData = await Hashing.hash(did);

		const query = { name: name, "userDID.hash": didHashData.hash };
		const request = await Certificate.find(query);
		return Promise.resolve(request);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
