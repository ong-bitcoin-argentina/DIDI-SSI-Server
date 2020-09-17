const mongoose = require("mongoose");

const AppAuthSchema = new mongoose.Schema({
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
	createdOn: {
		type: Date,
		default: new Date()
	}
});

const AppAuth = mongoose.model("AppAuth", AppAuthSchema);
module.exports = AppAuth;

AppAuth.getByDID = async function (did) {
	return await AppAuth.findOne({ did });
};
