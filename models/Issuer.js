const mongoose = require("mongoose");

// Registra los emisores autorizados a emitir certificados
const IssuerSchema = new mongoose.Schema({
	did: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	deleted: {
		type: Boolean,
		default: false
	},
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

IssuerSchema.index({ did: 1 }, { deleted: true });

const Issuer = mongoose.model("Issuer", IssuerSchema);
module.exports = Issuer;

// autorizar a un nuevo emisor a emitir certificados
Issuer.generate = async function(did, name) {
	try {
		const query = { did: did, deleted: false };
		const issuer = await Issuer.findOne(query);
		if (issuer) return Promise.resolve(null);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	let issuer = new Issuer();
	issuer.did = did;
	issuer.name = name;
	issuer.deleted = false;
	issuer.createdOn = new Date();

	try {
		issuer = await issuer.save();
		return Promise.resolve(issuer);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// revocar autorizacion de un nuevo emisor a emitir certificados
Issuer.delete = async function(did) {
	try {
		const query = { did: did, deleted: false };
		const action = { $set: { deleted: true } };
		let issuer = await Issuer.findOneAndUpdate(query, action);
		return Promise.resolve(issuer);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// retorna emisor no revocado a partir del did
Issuer.getIssuer = async function(did) {
	try {
		const query = { did: did, deleted: false };
		let issuer = await Issuer.findOne(query);
		return Promise.resolve(issuer);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
