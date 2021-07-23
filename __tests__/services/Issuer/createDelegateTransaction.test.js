const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { createDelegateTransaction } = require('../../../services/IssuerService');
const {
  missingDid, missingAction, missingToken, missingCallback,
} = require('../../../constants/serviceErrors');
const { data } = require('./constatns');

describe('services/Issuer/createDelegateTransaction.test.js', () => {
  const {
    did, token, callbackUrl, name, action,
  } = data;
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
    await mongoose.connection.db.dropCollection('delegatetransactions');
    await mongoose.connection.close();
  });
  describe('Should be green', () => {
    test('Expect createDelegateTransaction to throw on missing did', async () => {
      try {
        await createDelegateTransaction({
          undefined, name, callbackUrl, token, action,
        });
      } catch (e) {
        expect(e.code).toMatch(missingDid.code);
      }
    });

    test('Expect createDelegateTransaction to throw on missing callbackUrl', async () => {
      try {
        await createDelegateTransaction({
          did, name, undefined, token, action,
        });
      } catch (e) {
        expect(e.code).toMatch(missingCallback.code);
      }
    });

    test('Expect createDelegateTransaction to throw on missing token', async () => {
      try {
        await createDelegateTransaction({
          did, name, callbackUrl, undefined, action,
        });
      } catch (e) {
        expect(e.code).toMatch(missingToken.code);
      }
    });

    test('Expect createDelegateTransaction to throw on missing action', async () => {
      try {
        await createDelegateTransaction({
          did, name, callbackUrl, token, undefined,
        });
      } catch (e) {
        expect(e.code).toMatch(missingAction.code);
      }
    });

    test('Expect createDelegateTransaction to success', async () => {
      const response = await createDelegateTransaction({
        did, name, callbackUrl, token, action,
      });
      expect(response.did).toMatch(did);
    });
  });
});
