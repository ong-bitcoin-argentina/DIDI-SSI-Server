/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { saveShareRequest, getAll } = require('../../../services/ShareRequestService');
const { jwt, pagination } = require('./constant');

describe('__tests__/services/ShareRequest/getAll.test.js', () => {
  const { limit, page } = pagination;
  const saveShareReq = async () => {
    const cert = await jwt;
    await saveShareRequest({ jwt: cert });
  };
  for (let i = 0; i < 5; i++) {
    saveShareReq();
  }
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
    await mongoose.connection.db.dropCollection('sharerequests');
    await mongoose.connection.close();
  });

  test('Expect getAll to success', async () => {
    const { list, totalPages } = await getAll();
    expect(list.length).toBe(5);
    expect(totalPages).toBe(1);
  });

  test('Expect getAll to success passing limit parameter', async () => {
    const { list, totalPages } = await getAll(limit);
    expect.arrayContaining(list);
    expect(totalPages).toBe(5);
  });

  test('Expect getAll to success passing grater limit and page parameters', async () => {
    const { list, totalPages } = await getAll(limit + 1, page);
    expect.arrayContaining(list);
    expect(totalPages).toBe(3);
  });
});
