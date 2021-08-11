const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { editData, addIssuer } = require('../../../services/IssuerService');
const { missingDid } = require('../../../constants/serviceErrors');
const { revokeDelegate } = require('../../../services/BlockchainService');
const { data } = require('./constatns');
const Messages = require('../../../constants/Messages');

xdescribe('services/Issuer/editData.test.js', () => {
  const {
    did, name, secondName, secondDid, description, secondDescription,
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
    test('Expect editData to throw on missing did', async () => {
      try {
        await editData(undefined, 'name', 'description');
      } catch (e) {
        expect(e.code).toMatch(missingDid.code);
      }
    });

    test('Expect editData to success with name change', async () => {
      const response = await editData(did, secondName, description);
      expect(response.did).toMatch(did);
      expect(response.name).toMatch(secondName);
    });

    test('Expect editData to success with descripcion change', async () => {
      const response = await editData(did, secondName, secondDescription);
      expect(response.did).toMatch(did);
      expect(response.description).toMatch(secondDescription);
    });

    test('Expect editData to throw error on unregistered did', async () => {
      try {
        await editData(secondDid, name);
      } catch (e) {
        expect(e).toBe(Messages.ISSUER.ERR.DID_NOT_EXISTS);
      }
    });
  });
});
