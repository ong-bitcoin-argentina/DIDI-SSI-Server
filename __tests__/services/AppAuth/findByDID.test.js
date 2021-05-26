const mongoose = require('mongoose');
const { findByDID, createApp } = require('../../../services/AppAuthService');
const {
  missingDid,
} = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
// const { VALIDATION } = require('../../../constants/Messages');
const { appData } = require('./constans');

describe('Should be green', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await createApp(appData.did, appData.name);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('appauths');
    await mongoose.connection.close();
  });

  test('Expect findByDID to throw on missing did', async () => {
    try {
      await findByDID(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect findByDID to findByDid', async () => {
    const app = await findByDID(appData.did);
    expect(app.did).toBe(appData.did);
    expect(app.name).toBe(appData.name);
  });

  test('Expect findByDID return on missing find', async () => {
    try {
      await findByDID('did:bad:0x123');
    } catch (e) {
      expect(e.code).toMatch('APP_DID_NOT_FOUND');
    }
  });
});
