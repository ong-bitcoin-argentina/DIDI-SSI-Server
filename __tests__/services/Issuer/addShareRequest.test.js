/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { addShareRequests } = require('../../../services/IssuerService');
const { saveShareRequest } = require('../../../services/ShareRequestService');
const { missingDid, missingIds } = require('../../../constants/serviceErrors');
const { jwt, issuers } = require('./constatns');

describe('__tests__/services/Issuer/addShareRequests.test.js', () => {
  const ids = [];
  const id = [];
  const { did } = issuers[0];
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
      const { _id } = await saveShareRequest({ jwt: await jwt });
      ids.push(_id);
    }
    const { _id } = await saveShareRequest({ jwt: await jwt });
    id.push(_id);

    const Issuers = await mongoose.connection.db.collection('issuers');
    await Issuers.insertMany(issuers);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('sharerequests');
    await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });

  test('Expect addShareRequests to throw on missing did', async () => {
    try {
      await addShareRequests(ids, undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect addShareRequests to throw on missing ids', async () => {
    try {
      await addShareRequests(undefined, did);
    } catch (e) {
      expect(e.code).toMatch(missingIds.code);
    }
  });

  test('Expect addShareRequests to success saving multiple shareRequests ids', async () => {
    const { shareRequests } = await addShareRequests(ids, did);
    expect.arrayContaining(shareRequests);
    expect(shareRequests.length).toBe(5);
  });

  test('Expect addShareRequests to success', async () => {
    const { shareRequests } = await addShareRequests(id, issuers[1].did);
    expect.arrayContaining(shareRequests);
    expect(shareRequests.length).toBe(1);
  });
});
