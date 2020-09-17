const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const UserRondaSchema = new mongoose.Schema({
	userId: {
		type: ObjectId,
		unique: true,
		required: true,
		ref: "User"
	},
	did: {
		type: String,
		required: true,
		unique: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	}
});

const UserRonda = mongoose.model("UserRonda", UserRondaSchema);
module.exports = UserRonda;

UserRonda.getByDID = async function (did) {
	return await UserRonda.findOne({ did });
};
