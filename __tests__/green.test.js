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
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  test('Expect true to be true', () => {
    expect(true).toBe(true);
  });
});
