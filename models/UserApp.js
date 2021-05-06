const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const UserAppSchema = new mongoose.Schema({
  appAuthId: {
    type: ObjectId,
    required: true,
    ref: 'AppAuth',
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  modifiedOn: {
    type: Date,
  },
});

const UserApp = mongoose.model('UserApp', UserAppSchema);
module.exports = UserApp;

UserApp.getByDID = async function getByDID(did) {
  return UserApp.findOne()
    .populate({ path: 'userId', match: { did }, select: 'did' })
    .populate({ path: 'appAuthId', select: 'name' })
    .exec();
};

UserApp.getOrCreate = async function getOrCreate(userId, appAuthId) {
  const data = { userId, appAuthId };
  let userApp = await UserApp.findOne(data);
  if (!userApp) {
    userApp = await UserApp.create(data);
  }
  return userApp;
};
