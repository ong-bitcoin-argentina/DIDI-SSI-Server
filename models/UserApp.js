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

const UserApp = mongoose.model("UserApp", UserAppSchema);
module.exports = UserApp;

UserApp.getByDID = async function (did) {
	const result = await UserApp.find()
		.populate({ path: "userId", match: { did }, select: "did phoneNumber mail" })
		.exec();
	return result[0];
};

UserApp.generate = async function (userId, appAuthId) {
	const query = { userId, appAuthId };
	const action = { $set: { userId, appAuthId } };
	const options = { upsert: true, new: true };
	return await UserApp.findOneAndUpdate(query, action, options);
};
