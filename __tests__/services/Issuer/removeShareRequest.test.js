/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const ShareRequest = require('../../../models/ShareRequest');
const Issuer = require('../../../models/Issuer');
const { MONGO_URL } = require('../../../constants/Constants');
const { addShareRequests, removeShareRequest } = require('../../../services/IssuerService');
const { saveShareRequest } = require('../../../services/ShareRequestService');
const { missingDid, missingId } = require('../../../constants/serviceErrors');
const { jwt, issuers } = require('./constatns');

describe('__tests__/services/Issuer/removeShareRequest.test.js', () => {
  const ids = [];
  const { did } = issuers[0];
  let shareRequestsList;
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

    const Issuers = await mongoose.connection.db.collection('issuers');
    await Issuers.insertMany(issuers);
    const issuer = await addShareRequests(ids, did);
    shareRequestsList = issuer.shareRequests;
  });
  afterAll(async () => {
    for (let issuer of issuers) {
      // eslint-disable-next-line no-await-in-loop, no-underscore-dangle
      await Issuer.findOneAndDelete({ did: issuer.did });
    }
    for (let id of ids) {
      // eslint-disable-next-line no-await-in-loop
      await ShareRequest.findOneAndDelete({ _id: id });
    }
    await mongoose.connection.close();
  });

  test('Expect removeShareRequest to throw on missing did', async () => {
    try {
      await removeShareRequest(ids, undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect removeShareRequest to throw on missing id', async () => {
    try {
      await removeShareRequest(undefined, did);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect removeShareRequest to success', async () => {
    const shareRequestToRemove = shareRequestsList[0];
    const { shareRequests } = await removeShareRequest(shareRequestToRemove, did);
    expect(shareRequests.length).toBeLessThan(shareRequestsList.length);
    expect(shareRequests.find((id) => id === shareRequestToRemove)).toBeUndefined();
  });

  test('Expect removeShareRequest to fail whith invalid argument passed', async () => {
    try {
      const shareRequestToRemove = 'asd';
      await removeShareRequest(shareRequestToRemove, did);
    } catch (error) {
      expect(error.reason.toString().includes('Error: Argument passed')).toBeTruthy();
    }
  });
});
