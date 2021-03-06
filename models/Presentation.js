const mongoose = require('mongoose');
const Constants = require('../constants/Constants');

const { EXPIRE_IN_MINUTES } = Constants;

const PresentationSchema = mongoose.Schema({
  jwts: [
    {
      type: String,
    },
  ],
  expireOn: {
    type: Date,
    required: true,
  },
});

const Presentation = mongoose.model('Presentation', PresentationSchema);
module.exports = Presentation;

Presentation.generate = async function generate({ jwts }) {
  try {
    const date = new Date();
    date.setMinutes(date.getMinutes() + EXPIRE_IN_MINUTES);
    return await Presentation.create({ expireOn: date, jwts });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

Presentation.getById = async function getById(_id) {
  try {
    return await Presentation.findById(_id);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};
