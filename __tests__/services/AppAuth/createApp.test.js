const mongoose = require('mongoose');
const { createApp } = require('../../../services/AppAuthService');
const {
  missingDid, missingName,
} = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
const { mongoDuplicatedKey } = require('../../mongoErrors');

const { appData } = require('./constans');

describe('services/AppAuth/createApp.test.js', () => {
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
    await mongoose.connection.db.dropCollection('appauths');
    await mongoose.connection.close();
  });

  test('Expect createApp to throw on missing did', async () => {
    try {
      await createApp(undefined, 'name');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
    try {
      await createApp('', 'name');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createApp to throw on missing name', async () => {
    try {
      await createApp('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
    try {
      await createApp('did', '');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect createApp', async () => {
    await createApp(appData.did, appData.name);
  });

  test('Expect createApp to fail with duplicated did', async () => {
    try {
      await createApp(appData.did, `${appData.name}1`);
    } catch (e) {
      expect(e.code).toBe(mongoDuplicatedKey);
    }
  });

  test('Expect createApp to fail with duplicated name', async () => {
    try {
      await createApp(`${appData.did}1`, appData.name);
    } catch (e) {
      expect(e.code).toBe(mongoDuplicatedKey);
    }
  });
});
