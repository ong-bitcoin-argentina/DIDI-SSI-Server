const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const PhoneSchema = new mongoose.Schema({
	phoneNumber: {
		type: String,
		required: true
	},
	did: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true
	},
	validated: {
		type: Boolean,
		default: false
	},
	createdOn: {
		type: Date,
		default: Date.now()
	},
	expiresOn: {
		type: Date
	}
});

PhoneSchema.index(
	{ did: 1 },
	{
		unique: true
	}
);

// encrypt code
PhoneSchema.pre("save", function(next) {
	var phone = this;

	if (phone.isModified("code") || phone.isModified("did")) {
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) return next(err);

			bcrypt.hash(phone.code, salt, function(err, hashCode) {
				if (err) return next(err);

				phone.code = hashCode;
				next();
			});
		});
	}
});

PhoneSchema.methods.compareCode = function(candidateCode, cb, errCb) {
	bcrypt.compare(candidateCode, this.code, function(err, isMatch) {
		if (err) return errCb(err);
		cb(isMatch);
	});
};

PhoneSchema.methods.validatePhone = function(code, cb, errCb) {
	let self = this;
	return self.compareCode(
		code,
		function(isMatch) {
			if (!isMatch) return cb(null);
			return Phone.findOneAndUpdate({ _id: self._id }, { $set: { validated: true } }, function(err, _) {
				if (err) return errCb(err);
				self.validated = true;
				return cb(self);
			});
		},
		errCb
	);
};

const Phone = mongoose.model("Phone", PhoneSchema);
module.exports = Phone;

Phone.generate = function(phoneNumber, code, did, cb, errCb) {
	return Phone.findOne(
		{ did: did },
		{},
		function(err, phone) {
			if (err) return errCb(err);

			if (!phone) {
				phone = new Phone();
			}

			phone.phoneNumber = phoneNumber;
			phone.code = code;
			phone.did = did;
			phone.createdOn = new Date();

			let date = new Date();
			date.setHours(date.getHours() + 1);
			phone.expiresOn = date;

			phone.validated = false;

			return phone.save(function(err, phone) {
				if (err) return errCb(err);
				return cb(phone);
			});
		},
		errCb
	);
};

Phone.get = function(did, cb, errCb) {
	return Phone.findOne({ did: did, validated: false }, {}, function(err, phone) {
		if (err) return errCb(err);
		if (!phone || phone.expiresOn.getTime() < new Date().getTime()) return cb(null);
		return cb(phone);
	});
};

Phone.getValidated = function(did, cb, errCb) {
	return Phone.findOne({ did: did, validated: true }, {}, function(err, phone) {
		if (err) return errCb(err);
		if (!phone || phone.expiresOn.getTime() < new Date().getTime()) return cb(null);
		return cb(phone);
	});
};
