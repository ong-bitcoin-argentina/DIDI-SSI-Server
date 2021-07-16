const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const {
  missingOperationId,
} = require('../../../constants/serviceErrors');
const {
  getByOperationId, create,
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

  test('Expect getByOperationId to throw on missing operationId', async () => {
    try {
      await getByOperationId(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOperationId.code);
    }
  });

  test('Expect getByOperationId to getByOperationId', async () => {
    const result = await getByOperationId(appData.operationId);
    expect(result.operationId).toBe(appData.operationId);
    expect(result.userDID).toBe(appData.userDID);
  });
});
