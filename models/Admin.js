const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
	did: {
		type: String,
		unique: true,
		required: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	}
});

const Admin = mongoose.model("Admin", AdminSchema);

Admin.getByDID = async function (did) {
	return await Admin.findOne({ did });
};

module.exports = Admin;
