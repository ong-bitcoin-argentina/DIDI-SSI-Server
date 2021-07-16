const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const {
  missingDid,
} = require('../../../constants/serviceErrors');
const {
  getByDID, create,
} = require('../../../services/AuthRequestService');
const { appData } = require('./constanst');

describe('Should be green', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    const authRequest = await create(appData.operationId, appData.userDID);
    await authRequest.update('Successful', '');
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('authrequests');
    await mongoose.connection.close();
  });

  test('Expect getByDID to throw on missing did', async () => {
    try {
      await getByDID(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect getByDID to getByDID', async () => {
    const result = await getByDID(appData.userDID);
    expect(result.operationId).toBe(appData.operationId);
  });
});
