const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const UserAppSchema = new mongoose.Schema({
	appAuthId: {
		type: ObjectId,
		required: true,
		ref: "AppAuth"
	},
	userId: {
		type: ObjectId,
		required: true,
		ref: "User"
	},
	createdOn: {
		type: Date,
		default: new Date()
	},
	modifiedOn: {
		type: Date
	}
});

UserAppSchema.pre("findOneAndUpdate", function (next) {
	this.update({}, { modifiedOn: new Date() });
	next();
});

const UserApp = mongoose.model("UserApp", UserAppSchema);
module.exports = UserApp;

UserApp.getByDID = async function (did) {
	return await UserApp.find().populate({ path: "userId", match: { did } });
};
