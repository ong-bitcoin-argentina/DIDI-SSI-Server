const mongoose = require("mongoose");
const Constants = require("../constants/Constants");

const statuses = [
	Constants.CERTIFICATE_STATUS.UNVERIFIED,
	Constants.CERTIFICATE_STATUS.VERIFIED,
	Constants.CERTIFICATE_STATUS.REVOKED
];

const CertificateSchema = new mongoose.Schema({
	userDID: {
		type: String,
		required: true
	},
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
	jwt: {
		type: String,
		required: true
	},
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

CertificateSchema.index({ name: 1, hash: 1 });

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

const Certificate = mongoose.model("Certificate", CertificateSchema);
module.exports = Certificate;

Certificate.generate = async function(name, userDID, status, jwt, hash) {
	try {
		let certStatus = await Certificate.findOne({ jwt: jwt, hash: hash, name: name });
		if (!certStatus) certStatus = new Certificate();
		certStatus.name = name;
		certStatus.userDID = userDID;
		certStatus.status = status;
		certStatus.jwt = jwt;
		certStatus.hash = hash;
		certStatus.createdOn = new Date();
		certStatus = await certStatus.save();
		return Promise.resolve(certStatus);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Certificate.findByJwt = async function(jwt) {
	try {
		const query = { jwt: jwt };
		const request = await Certificate.findOne(query);
		return Promise.resolve(request);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Certificate.findByName = async function(did, name) {
	try {
		const query = { name: name, userDID: did };
		const request = await Certificate.find(query);
		return Promise.resolve(request);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
