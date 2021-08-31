const mongoose = require('mongoose');

const DelegateTransactionSchema = new mongoose.Schema({
  name: String,
  action: {
    type: String,
    required: true,
  },
  did: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  token: {
    type: String,
  },
  callbackUrl: {
    type: String,
  },
});

const DelegateTransaction = mongoose.model('DelegateTransaction', DelegateTransactionSchema);
module.exports = DelegateTransaction;
