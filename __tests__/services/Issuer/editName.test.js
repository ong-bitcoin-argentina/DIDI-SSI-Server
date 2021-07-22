const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { editName, addIssuer, getIssuerByDID } = require('../../../services/IssuerService');
const { missingDid, missingName } = require('../../../constants/serviceErrors');
const { revokeDelegate } = require('../../../services/BlockchainService');
const { data } = require('./constatns');
const Messages = require('../../../constants/Messages');

describe('services/Issuer/editName.test.js', () => {
  const { did, name, secondName } = data;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await addIssuer(did, name);
  });
  afterAll(async () => {
    await revokeDelegate(did);
    await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });
  describe('Should be green', () => {
    test('Expect editName to throw on missing did', async () => {
      try {
        await editName(undefined, 'name');
      } catch (e) {
        expect(e.code).toMatch(missingDid.code);
      }
    });

    test('Expect editName to throw on missing name', async () => {
      try {
        await editName('did', undefined);
      } catch (e) {
        expect(e.code).toMatch(missingName.code);
      }
    });

    test('Expect editName to success', async () => {
      await editName(did, secondName);
      const issuer = await getIssuerByDID(did);
      expect(issuer.did).toMatch(did);
      expect(issuer.name).toMatch(secondName);
    });

    test('Expect editName to throw error on invalid did', async () => {
      try {
        await editName(did, name);
      } catch (e) {
        expect(e).toBe(Messages.ISSUER.ERR.DID_NOT_EXISTS);
      }
    });
  });
});
