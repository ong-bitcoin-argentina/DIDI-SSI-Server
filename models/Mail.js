const mongoose = require("mongoose");

const Constants = require("../constants/Constants");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const MailSchema = new mongoose.Schema({
	email: {
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

MailSchema.index(
	{ did: 1 },
	{
		unique: true
	}
);

// encrypt code
MailSchema.pre("save", function(next) {
	var mail = this;

	if (mail.isModified("code") || mail.isModified("did")) {
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) return next(err);

			bcrypt.hash(mail.code, salt, function(err, hashCode) {
				if (err) return next(err);
				mail.code = hashCode;
				next();
			});
		});
	}
});

MailSchema.methods.compareCode = function(candidateCode, cb, errCb) {
	bcrypt.compare(candidateCode, this.code, function(err, isMatch) {
		if (err) return errCb(err);
		cb(isMatch);
	});
};

MailSchema.methods.validateMail = function(code, cb, errCb) {
	let self = this;
	return self.compareCode(
		code,
		function(isMatch) {
			if (!isMatch) return cb(null);
			return Mail.findOneAndUpdate({ _id: self._id }, { $set: { validated: true } }, function(err, _) {
				if (err) return errCb(err);
				self.validated = true;
				return cb(self);
			});
		},
		errCb
	);
};

const Mail = mongoose.model("Mail", MailSchema);
module.exports = Mail;

Mail.generate = function(email, code, did, cb, errCb) {
	return Mail.findOne(
		{ did: did },
		{},
		function(err, mail) {
			if (err) return errCb(err);

			if (!mail) {
				mail = new Mail();
			}

			mail.email = email;
			mail.code = code;
			mail.did = did;
			mail.createdOn = new Date();

			let date = new Date();
			date.setHours(date.getHours() + Constants.HOURS_BEFORE_CODE_EXPIRES);
			mail.expiresOn = date;

			mail.validated = false;

			return mail.save(function(err, mail) {
				if (err) return errCb(err);
				return cb(mail);
			});
		},
		errCb
	);
};

Mail.get = function(did, cb, errCb) {
	return Mail.findOne({ did: did, validated: false }, {}, function(err, mail) {
		if (err) return errCb(err);
		if (!mail || mail.expiresOn.getTime() < new Date().getTime()) return cb(null);
		return cb(mail);
	});
};

Mail.getValidated = function(did, cb, errCb) {
	return Mail.findOne({ did: did, validated: true }, {}, function(err, mail) {
		if (err) return errCb(err);
		if (!mail || mail.expiresOn.getTime() < new Date().getTime()) return cb(null);
		return cb(mail);
	});
};
