const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { getIssuerByDID, addIssuer } = require('../../../services/IssuerService');
const { missingDid } = require('../../../constants/serviceErrors');
const { revokeDelegate } = require('../../../services/BlockchainService');
const { data } = require('./constatns');
const Messages = require('../../../constants/Messages');

xdescribe('services/Issuer/getIssuerByDID.test.js', () => {
  const {
    did, name, secondDid, description,
  } = data;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await addIssuer(did, name, description);
  });
  afterAll(async () => {
    await revokeDelegate(did);
    await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });
  describe('Should be green', () => {
    test('Expect getIssuerByDID to throw on missing did', async () => {
      try {
        await getIssuerByDID(undefined);
      } catch (e) {
        expect(e.code).toMatch(missingDid.code);
      }
    });

    test('Expect getIssuerByDID to success', async () => {
      const response = await getIssuerByDID(did);
      expect(response.did).toBe(did);
    });

    test('Expect getIssuerByDID to throw error on invalid did', async () => {
      try {
        await getIssuerByDID(secondDid);
      } catch (e) {
        expect(e).toBe(Messages.ISSUER.ERR.DID_NOT_EXISTS);
      }
    });
  });
});
