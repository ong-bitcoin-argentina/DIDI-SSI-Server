/* eslint-disable no-console */
const mongoose = require('mongoose');
const {
  MONGO_URL,
} = require('../constants/Constants');

describe('Should be green', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
  }, 60000);
  test('Expect true to be true', () => {
    expect(true).toBe(true);
  });
});
