const mongoose = require('mongoose');
const { create } = require('../../../services/AuthRequestService');
const {
  missingOperationId,
  missingUserDID,
} = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');

const { appData } = require('./constanst');

describe('services/AuthRequest/create.test.js', () => {
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
    await mongoose.connection.db.dropCollection('authrequests');
    await mongoose.connection.close();
  });

  test('Expect create to throw on missing operationId', async () => {
    try {
      await create(undefined, 'userDID');
    } catch (e) {
      expect(e.code).toMatch(missingOperationId.code);
    }
  });

  test('Expect create to throw on missing userDID', async () => {
    try {
      await create('operationId', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingUserDID.code);
    }
  });

  test('Expect create to create', async () => {
    const result = await create(appData.operationId, appData.userDID);
    expect(result.operationId).toMatch(appData.operationId);
    expect(result.userDID).toMatch(appData.userDID);
  });
});
