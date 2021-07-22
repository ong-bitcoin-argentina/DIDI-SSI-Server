const { addFront } = require('../../../services/RenaperService');
const {
  missingDni, missingGender, missingOperationId, missingFrontImage,
} = require('../../../constants/serviceErrors');

describe('services/Renaper/addFront.test.js', () => {
  test('Expect addFront to throw on missing dni', async () => {
    try {
      await addFront(undefined, 'gender', 'operationId', 'frontImage', 'analyzeAnomalies', 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });

  test('Expect addFront to throw on missing gender', async () => {
    try {
      await addFront('dni', undefined, 'operationId', 'frontImage', 'analyzeAnomalies', 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingGender.code);
    }
  });

  test('Expect addFront to throw on missing operationId', async () => {
    try {
      await addFront('dni', 'gender', undefined, 'frontImage', 'analyzeAnomalies', 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingOperationId.code);
    }
  });

  test('Expect addFront to throw on missing frontImage', async () => {
    try {
      await addFront('dni', 'gender', 'operationId', undefined, 'analyzeAnomalies', 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingFrontImage.code);
    }
  });
});
