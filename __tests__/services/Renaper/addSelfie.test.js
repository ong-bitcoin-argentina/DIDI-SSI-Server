const { addSelfie } = require('../../../services/RenaperService');
const {
  missingDni, missingGender, missingOperationId, missingSelfie,
} = require('../../../constants/serviceErrors');

describe('services/Renaper/addSelfie.test.js', () => {
  test('Expect addSelfie to throw on missing dni', async () => {
    try {
      await addSelfie(undefined, 'gender', 'operationId', 'selfie');
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });

  test('Expect addSelfie to throw on missing gender', async () => {
    try {
      await addSelfie('dni', undefined, 'operationId', 'selfie');
    } catch (e) {
      expect(e.code).toMatch(missingGender.code);
    }
  });

  test('Expect addSelfie to throw on missing operationId', async () => {
    try {
      await addSelfie('dni', 'gender', undefined, 'selfie');
    } catch (e) {
      expect(e.code).toMatch(missingOperationId.code);
    }
  });

  test('Expect addSelfie to throw on missing selfie', async () => {
    try {
      await addSelfie('dni', 'gender', 'operationId', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingSelfie.code);
    }
  });
});
