/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

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
  },
  delegationHashes: {
    type: [
      {
        network: {
          type: String,
          required: true,
        },
        transactionHash: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
    // Para evitar guardar un array vacio, definimos como default: undefined.
    default: undefined,
  },
  shareRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'ShareRequest',
  }],
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
  const aggregateDef = [
    {
      $lookup: {
        from: 'sharerequests',
        localField: 'shareRequests',
        foreignField: '_id',
        as: 'result',
      },
    },
    {
      $match: {
        result: {
          $exists: true,
          $not: {
            $size: 0,
          },
        },
      },
    },
    {
      $sort: { name: 1 },
    },
  ];

  if (limit === 0 || isNaN(limit)) {
    totalPages = 1;
  } else {
    const registers = await Issuer.aggregate(aggregateDef);
    totalPages = Math.ceil(registers.length / limit);
  }

  const issuersList = await Issuer.aggregate(aggregateDef).collation({
    locale: 'es',
    caseFirst: 'off',
  }).sort({ name: 1 })
    .skip(page > 0 ? ((page - 1) * limit) : 0)
    .limit(limit);
  issuersList.forEach((issuer) => {
    // eslint-disable-next-line no-param-reassign
    issuer.shareRequests = [];
    issuer.result.forEach((presentation) => issuer.shareRequests.push(presentation._id));
  });
  return { issuersList, totalPages };
};

Issuer.getByDID = async function getByDID(did) {
  return Issuer.findOne({ did });
};

Issuer.getByName = async function getByName(name) {
  return Issuer.findOne({ name });
};

Issuer.addShareRequests = async function addShareRequests(ids, did) {
  return Issuer.findOneAndUpdate(
    { did },
    { $push: { shareRequests: { $each: ids } } },
    { new: true },
  );
};

Issuer.removeShareRequest = async function removeShareRequest(id, did) {
  return Issuer.findOneAndUpdate(
    { did },
    { $pull: { shareRequests: id } },
    { new: true },
  );
};
