/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const IssuerSchema = new mongoose.Schema({
  did: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
  },
  blockHash: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  expireOn: {
    type: Date,
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

IssuerSchema.pre('findOneAndUpdate', function pre(next) {
  this.update({}, { modifiedOn: new Date() });
  next();
});

IssuerSchema.methods.delete = async function delet() {
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: { deleted: true },
  };

  try {
    await Issuer.findOneAndUpdate(updateQuery, updateAction);
    this.deleted = true;
    return Promise.resolve(this);
  } catch (err) {
    return Promise.reject(err);
  }
};

IssuerSchema.methods.edit = async function edit(data) {
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: data,
  };

  try {
    return await Issuer.findOneAndUpdate(updateQuery, updateAction);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

IssuerSchema.methods.editName = async function editName(name) {
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: { name },
  };

  try {
    return await Issuer.findOneAndUpdate(updateQuery, updateAction);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

IssuerSchema.methods.editDescription = async function editDescription(description) {
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: { description },
  };

  try {
    return await Issuer.findOneAndUpdate(updateQuery, updateAction);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

IssuerSchema.methods.updateImage = async function updateImage(imageId) {
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: { imageId },
  };

  try {
    await Issuer.findOneAndUpdate(updateQuery, updateAction);
    this.imageId = imageId;
    return Promise.resolve(this);
  } catch (err) {
    return Promise.reject(err);
  }
};

const Issuer = mongoose.model('Issuer', IssuerSchema);
module.exports = Issuer;

Issuer.getByDID = async function getByDID(did) {
  return Issuer.findOne({ did });
};

Issuer.getByName = async function getByName(name) {
  return Issuer.findOne({ name });
};
