const mongoose = require("mongoose");

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
	{ email: 1, validated: 1 },
	{
		unique: true
	}
);

// MailSchema.index({ createdOn: 1 }, { expireAfterSeconds: 3600 });

MailSchema.pre("save", function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (user.isModified("code") || user.isModified("did")) {
		// generate a salt
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) return next(err);

			// hash the password using our new salt
			bcrypt.hash(user.code, salt, function(err, hashCode) {
				if (err) return next(err);

				user.code = hashCode;
				bcrypt.hash(user.did, salt, function(err, hashDid) {
					if (err) return next(err);

					user.did = hashDid;
					next();
				});
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
			console.log(self._id);
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
	return Mail.get(
		email,
		function(mail) {
			if (!mail) {
				mail = new Mail();
			}

			mail.email = email;
			mail.code = code;
			mail.did = did;
			mail.createdOn = new Date();

			let date = new Date();
			date.setHours(date.getHours() + 1);
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

Mail.get = function(email, cb, errCb) {
	return Mail.findOne({ email: email, validated: false }, function(err, mail) {
		if (err) return errCb(err);
		if (!mail || mail.expiresOn.getTime() < new Date().getTime()) return cb(null);
		return cb(mail);
	});
};
