const mongoose = require("mongoose");

const IssuerSchema = new mongoose.Schema({
	did: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		unique: true,
		required: true
	},
	expireOn: {
		type: Date,
		required: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	},
	modifiedOn: {
		type: Date
	}
});

IssuerSchema.pre("findOneAndUpdate", function (next) {
	this.update({}, { modifiedOn: new Date() });
	next();
});

const Issuer = mongoose.model("Issuer", IssuerSchema);
module.exports = Issuer;

Issuer.getByDID = async function (did) {
	return await Issuer.findOne({ did });
};

Issuer.getByName = async function (name) {
	return await Issuer.findOne({ name });
};
