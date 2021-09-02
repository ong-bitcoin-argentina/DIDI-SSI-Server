const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const Issuer = require('../../../models/Issuer');
const { issuers } = require('./constants');

describe('models/Issuer/getAll.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

    const Issuers = await mongoose.connection.db.collection('issuers');
    await Issuers.insertMany(issuers);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });

  test('Expect getAll to success', async () => {
    const { totalPages, issuersList } = await Issuer.getAll();
    expect.arrayContaining(issuersList);
    expect(issuersList[1].imageUrl).toBe(undefined);
    expect(totalPages).toBe(1);
  });

  test('Expect getAll to get an issuer with imageUrl', async () => {
    const { totalPages, issuersList } = await Issuer.getAll();
    expect.arrayContaining(issuersList);
    expect(issuersList[0].imageUrl).toBe(issuersList[0].imageUrl);
    expect(totalPages).toBe(1);
  });
});
