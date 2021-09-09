/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
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
  imageUrl: {
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
},
{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
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
  const { name, description } = data;
  try {
    return await Issuer.findByIdAndUpdate(
      { _id: this._id },
      {
        $set: {
          name,
          description,
        },
      },
      { new: true, omitUndefined: true },
    );
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

IssuerSchema.methods.updateImage = async function updateImage(imageUrl) {
  try {
    return await Issuer.findByIdAndUpdate({ _id: this._id }, { imageUrl }, { new: true });
  } catch (err) {
    return Promise.reject(err);
  }
};

const Issuer = mongoose.model('Issuer', IssuerSchema);
module.exports = Issuer;

Issuer.getAll = async function getAll(limit, page) {
  let totalPages;
  if (limit === 0 || isNaN(limit)) {
    totalPages = 1;
  } else {
    totalPages = Math.ceil(await Issuer.find({
      deleted: false,
    }).countDocuments() / limit);
  }

  const issuersList = await Issuer.find({
    deleted: false,
  },
  {
    did: 1, name: 1, description: 1, imageUrl: 1,
  })
    .collation({
      locale: 'es',
      caseFirst: 'off',
    })
    .sort({ name: 1 })
    .skip(page > 0 ? ((page - 1) * limit) : 0)
    .limit(limit);
  return { issuersList, totalPages };
};

Issuer.getByDID = async function getByDID(did) {
  return Issuer.findOne({ did });
};

Issuer.getByName = async function getByName(name) {
  return Issuer.findOne({ name });
};
