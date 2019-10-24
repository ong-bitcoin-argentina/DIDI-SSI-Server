var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
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
	},
	modifiedOn: {
		type: Date,
		default: Date.now()
	}
});

UserSchema.index({ name: 1 });
module.exports = mongoose.model("User", UserSchema);
