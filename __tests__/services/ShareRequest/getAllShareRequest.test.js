/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { saveShareRequest, getAll } = require('../../../services/ShareRequestService');
const {
  jwt, pagination, serverDid, aud, jwt2, aud2,
} = require('./constant');

describe('__tests__/services/ShareRequest/getAll.test.js', () => {
  const { limit, page } = pagination;
  const solicitorDid = serverDid;

  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line no-await-in-loop
      await saveShareRequest({ jwt: await jwt });
    }
    await saveShareRequest({ jwt: await jwt2 });
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('sharerequests');
    await mongoose.connection.close();
  });

  test('Expect getAll to success with aud', async () => {
    const { list, totalPages } = await getAll(100, 1, aud, undefined, solicitorDid);
    expect(list.length).toBe(5);
    expect(totalPages).toBe(1);
  });

  test('Expect getAll to success with iss', async () => {
    const iss = serverDid;
    const { list, totalPages } = await getAll(100, 1, undefined, iss, aud2);
    expect(list.length).toBe(1);
    expect(totalPages).toBe(1);
  });
});
