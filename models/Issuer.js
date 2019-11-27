const mongoose = require("mongoose");

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
