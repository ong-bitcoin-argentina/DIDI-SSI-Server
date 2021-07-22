const { addBack } = require('../../../services/RenaperService');
const {
  missingDni, missingGender, missingOperationId, missingBackImage,
} = require('../../../constants/serviceErrors');

describe('services/Renaper/addBack.test.js', () => {
  test('Expect addBack to throw on missing dni', async () => {
    try {
      await addBack(undefined, 'gender', 'operationId', 'backImage', 'analyzeAnomalies', 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });

  test('Expect addBack to throw on missing gender', async () => {
    try {
      await addBack('dni', undefined, 'operationId', 'backImage', 'analyzeAnomalies', 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingGender.code);
    }
  });

  test('Expect addBack to throw on missing operationId', async () => {
    try {
      await addBack('dni', 'gender', undefined, 'backImage', 'analyzeAnomalies', 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingOperationId.code);
    }
  });

  test('Expect addBack to throw on missing backImage', async () => {
    try {
      await addBack('dni', 'gender', 'operationId', undefined, 'analyzeAnomalies', 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingBackImage.code);
    }
  });
});
