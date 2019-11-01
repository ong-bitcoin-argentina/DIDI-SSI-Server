const mongoose = require("mongoose");
const Hashing = require("./utils/Hashing");

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
		salt: {
			type: String,
			required: true
		},
		hash: {
			type: String,
			required: true
		}
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

PhoneSchema.methods.compareCode = function(candidateCode, cb, errCb) {
	try {
		const result = Hashing.validateHash(candidateCode, this.code);
		return cb(result);
	} catch (err) {
		console.log(err);
		return errCb(err);
	}
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
			phone.did = did;
			phone.createdOn = new Date();

			let date = new Date();
			date.setHours(date.getHours() + 1);
			phone.expiresOn = date;

			phone.validated = false;

			try {
				phone.code = Hashing.hash(code);
			} catch (err) {
				return errCb(err);
			}

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
