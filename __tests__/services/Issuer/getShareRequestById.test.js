/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const ShareRequest = require('../../../models/ShareRequest');
const Issuer = require('../../../models/Issuer');
const { MONGO_URL } = require('../../../constants/Constants');
const { addShareRequests, getShareRequestById } = require('../../../services/IssuerService');
const { saveShareRequest } = require('../../../services/ShareRequestService');
const { missingId } = require('../../../constants/serviceErrors');
const { jwt, issuers } = require('./constatns');
const Messages = require('../../../constants/Messages');

describe('__tests__/services/Issuer/getShareRequestById.test.js', () => {
  const { did } = issuers[0];
  let id;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

    const { _id } = await saveShareRequest({ jwt: await jwt });
    id = _id;

    const Issuers = await mongoose.connection.db.collection('issuers');
    await Issuers.insertMany(issuers);
    await addShareRequests([_id], did);
  });
  afterAll(async () => {
    for (let issuer of issuers) {
      // eslint-disable-next-line no-await-in-loop, no-underscore-dangle
      await Issuer.findOneAndDelete({ did: issuer.did });
    }
    await ShareRequest.findOneAndDelete({ _id: id });
    await mongoose.connection.close();
  });

  test('Expect getShareRequestById to throw on missing id', async () => {
    try {
      await getShareRequestById(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect getShareRequestById to success', async () => {
    const { _id } = await getShareRequestById(id);
    expect(_id.toString()).toMatch(id.toString());
  });

  test('Expect getShareRequestById to throw on invalid unexistent id', async () => {
    const invalidId = new mongoose.Types.ObjectId();
    try {
      await getShareRequestById(invalidId);
    } catch (e) {
      expect(e.code).toMatch(Messages.SHAREREQUEST.ERR.NOT_FOUND);
    }
  });
});
