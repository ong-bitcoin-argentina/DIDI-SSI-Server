const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const {
  missingStatus,
} = require('../../../constants/serviceErrors');
const {
  update, create,
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
    await create(appData.operationId, appData.userDID);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('authrequests');
    await mongoose.connection.close();
  });

  test('Expect update to throw on missing status', async () => {
    try {
      await update(undefined, 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingStatus.code);
    }
  });

  test.skip('Expect update to update', async () => {
    await update(appData.status, 'errMsg');
  });
});
