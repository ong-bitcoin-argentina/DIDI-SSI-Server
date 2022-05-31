/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { saveShareRequest, getAll } = require('../../../services/ShareRequestService');
const { missingDid } = require('../../../constants/serviceErrors');
const {
  jwt, serverDid, aud, jwt2,
} = require('./constant');

describe('__tests__/services/ShareRequest/getAll.test.js', () => {
  const solicitorDid = serverDid;

  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
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

  test('Expect getAll to throw on missing solicitorDid', async () => {
    try {
      await getAll(100, 1, undefined, undefined, undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect getAll to success with aud', async () => {
    const { list, totalPages } = await getAll(100, 1, aud, undefined, undefined);
    expect(list.length).toBe(5);
    expect(totalPages).toBe(1);
  });

  test('Expect getAll to success with iss', async () => {
    const iss = serverDid;
    const { list, totalPages } = await getAll(100, 1, undefined, iss, undefined);
    expect(list.length).toBe(6);
    expect(totalPages).toBe(1);
  });

  test('Expect getAll to success without iss & aud', async () => {
    const { list, totalPages } = await getAll(100, 1, undefined, undefined, solicitorDid);
    expect(list.length).toBe(6);
    expect(totalPages).toBe(1);
  });
});
