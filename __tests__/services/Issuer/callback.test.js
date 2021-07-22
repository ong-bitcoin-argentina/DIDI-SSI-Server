const mongoose = require('mongoose');
const fetch = require('node-fetch');
const { MONGO_URL } = require('../../../constants/Constants');
const { callback } = require('../../../services/IssuerService');
const {
  missingDid, missingUrl, missingToken, missingData,
} = require('../../../constants/serviceErrors');
const { data } = require('./constatns');
const { postOptionsAuth, deleteOptionsAuth } = require('./utils');

describe('services/Issuer/callback.test.js', () => {
  const {
    rskDid, token, callbackUrl, name, key,
  } = data;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await fetch(`${callbackUrl}`, postOptionsAuth(token, { rskDid, name, key }));
  });
  afterAll(async () => {
    await fetch(`${callbackUrl}/${rskDid}`, deleteOptionsAuth(token, {}));
    await mongoose.connection.close();
  });
  describe('Should be green', () => {
    test('Expect callback to throw on missing url', async () => {
      try {
        await callback(undefined, 'did', 'token', 'data');
      } catch (e) {
        expect(e.code).toMatch(missingUrl.code);
      }
    });

    test('Expect callback to throw on missing did', async () => {
      try {
        await callback('url', undefined, 'token', 'data');
      } catch (e) {
        expect(e.code).toMatch(missingDid.code);
      }
    });

    test('Expect callback to throw on missing token', async () => {
      try {
        await callback('url', 'did', undefined, 'data');
      } catch (e) {
        expect(e.code).toMatch(missingToken.code);
      }
    });

    test('Expect callback to throw on missing data', async () => {
      try {
        await callback('url', 'did', 'token', undefined);
      } catch (e) {
        expect(e.code).toMatch(missingData.code);
      }
    });

    test('Expect callback to throw on missing data', async () => {
      const response = await callback(callbackUrl, rskDid, token, { status: 'Creado' });
      expect(response).not.toBe(null);
    });
  });
});
