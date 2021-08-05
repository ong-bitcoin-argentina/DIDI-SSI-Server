const { endOperation } = require('../../../services/RenaperService');
const {
  missingDni, missingGender, missingOperationId,
} = require('../../../constants/serviceErrors');

describe('services/Renaper/endOperation.test.js', () => {
  test('Expect endOperation to throw on missing dni', async () => {
    try {
      await endOperation(undefined, 'gender', 'operationId');
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });

  test('Expect endOperation to throw on missing gender', async () => {
    try {
      await endOperation('dni', undefined, 'operationId');
    } catch (e) {
      expect(e.code).toMatch(missingGender.code);
    }
  });

  test('Expect endOperation to throw on missing operationId', async () => {
    try {
      await endOperation('dni', 'gender', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOperationId.code);
    }
  });
});
