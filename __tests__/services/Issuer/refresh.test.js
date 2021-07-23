const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { refresh, addIssuer } = require('../../../services/IssuerService');
const { missingDid } = require('../../../constants/serviceErrors');
const { revokeDelegate } = require('../../../services/BlockchainService');
const { data } = require('./constatns');
const Messages = require('../../../constants/Messages');

describe('services/Issuer/refresh.test.js', () => {
  const { did, name, secondDid } = data;
  let issuerExp;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    const response = await addIssuer(did, name);
    issuerExp = response.expireOn;
  });
  afterAll(async () => {
    await revokeDelegate(did);
    await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });
  describe('Should be green', () => {
    test('Expect refresh to throw on missing did', async () => {
      try {
        await refresh(undefined);
      } catch (e) {
        expect(e.code).toMatch(missingDid.code);
      }
    });

    test('Expect refresh to success', async () => {
      const response = await refresh(did);
      expect(response.expireOn).not.toBe(issuerExp);
    });

    test('Expect refresh to throw error on unregistered did', async () => {
      try {
        await refresh(secondDid);
      } catch (e) {
        expect(e).toBe(Messages.ISSUER.ERR.DID_NOT_EXISTS);
      }
    });
  });
});
