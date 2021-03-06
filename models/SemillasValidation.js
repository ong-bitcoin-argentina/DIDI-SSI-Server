const mongoose = require('mongoose');
const { inProgress, failure, success } = require('./dataTypes/ValidationStates');

const SemillasValidationSchema = new mongoose.Schema({
  userDID: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
    enum: [inProgress, failure, success],
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  modifiedOn: {
    type: Date,
    default: new Date(),
  },
});

SemillasValidationSchema.pre('findOneAndUpdate', function pre(next) {
  this.update({}, { modifiedOn: new Date() });
  next();
});

const SemillasValidation = mongoose.model('SemillasValidation', SemillasValidationSchema);
module.exports = SemillasValidation;

SemillasValidation.generate = async function generate(userDID) {
  const item = new SemillasValidation();
  item.userDID = userDID;
  item.state = inProgress;
  item.createdOn = new Date();
  item.modifiedOn = new Date();
  await item.save();
  return item;
};

SemillasValidation.getByUserDID = async function getByUserDID(userDID) {
  return SemillasValidation.findOne({ userDID }).select('modifiedOn createdOn state');
};

SemillasValidation.updateByUserDID = async function updateByUserDID(userDID, state) {
  const query = { userDID };
  const action = { $set: { state } };
  const options = { new: true, runValidators: true };
  return SemillasValidation.findOneAndUpdate(query, action, options);
};

SemillasValidation.deleteByUserDID = async function deleteByUserDID(userDID) {
  const query = { userDID };
  return SemillasValidation.findOneAndDelete(query);
};
