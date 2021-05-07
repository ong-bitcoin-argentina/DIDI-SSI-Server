const {
  create,
  getByOperationId,
  getByDID,
  update,
} = require('../../services/AuthRequestService');
const {
  missingOperationId,
  missingUserDID,
  missingDid,
  missingErrMsg,
  missingStatus,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
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

  test('Expect getByOperationId to throw on missing operationId', async () => {
    try {
      await getByOperationId(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOperationId.code);
    }
  });

  test('Expect getByDID to throw on missing did', async () => {
    try {
      await getByDID(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect update to throw on missing status', async () => {
    try {
      await update(undefined, 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingStatus.code);
    }
  });

  test('Expect update to throw on missing errMsg', async () => {
    try {
      await update('status', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingErrMsg.code);
    }
  });
});
