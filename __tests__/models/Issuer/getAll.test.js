const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const Issuer = require('../../../models/Issuer');
const { issuer } = require('./constants');
const { getImageUrl } = require('../../../utils/Helpers');

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
    await Issuers.insert(issuer);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });

  test('Expect getAll to success', async () => {
    const { totalPages, issuersList } = await Issuer.getAll();
    expect.arrayContaining(issuersList);
    expect(issuersList[1].imageId).toBe(undefined);
    expect(totalPages).toBe(1);
  });

  test('Expect getAll to get an issuer with imageId', async () => {
    const { totalPages, issuersList } = await Issuer.getAll();
    expect.arrayContaining(issuersList);
    expect(issuersList[0].imageId).not.toBe(null);
    expect(issuersList[0].imageUrl).toBe(getImageUrl(issuersList[0].imageId));
    expect(totalPages).toBe(1);
  });
});
