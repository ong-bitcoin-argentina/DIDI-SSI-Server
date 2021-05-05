const mongoose = require('mongoose');

const AppAuthSchema = new mongoose.Schema({
  did: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  modifiedOn: {
    type: Date,
  },
});

AppAuthSchema.pre('findOneAndUpdate', function pre(next) {
  this.update({}, { modifiedOn: new Date() });
  next();
});

const AppAuth = mongoose.model('AppAuth', AppAuthSchema);
module.exports = AppAuth;

AppAuth.getByDID = async function getByDID(did) {
  return AppAuth.findOne({ did });
};
