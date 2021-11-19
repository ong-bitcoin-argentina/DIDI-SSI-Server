/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { getAll } = require('../../../services/IssuerService');
const { issuers, pagination } = require('./constatns');

describe('services/Issuer/getAll.test.js', () => {
  const { limit, page } = pagination;
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
    const response = await getAll();
    expect.arrayContaining(response.issuersList);
    expect(response.totalPages).toBe(1);
    for (let i = 0; i <= response.length; i++) {
      expect(response[i].toHavePropert('shareRequests'));
      expect(response[i].toHavePropert('did'));
      expect(response[i].toHavePropert('name'));
      expect.arrayContaining(response[i].shareRequests);
    }
  });

  test('Expect getAll to success passing limit parameter', async () => {
    const response = await getAll(limit);
    expect.arrayContaining(response.issuersList);
    expect(response.totalPages).toBe(4);
  });

  test('Expect getAll to success passing grater limit and page parameters', async () => {
    const response = await getAll(limit + 1, page);
    expect.arrayContaining(response.issuersList);
    expect(response.totalPages).toBe(2);
  });
});
