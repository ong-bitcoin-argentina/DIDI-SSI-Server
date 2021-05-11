const {
  scanBarcode,
  newOpperation,
  addFront,
  addBack,
  addSelfie,
  addBarcode,
  endOperation,
} = require('../../services/RenaperService');
const {
  missingFile,
  missingGender,
  missingDni,
  missingDeviceIp,
  missingFingerprintData,
  missingOperationId,
  missingFrontImage,
  missingAnalyzeAnomalies,
  missingAnalyzeOcr,
  missingBackImage,
  missingSelfie,
  missingLastName,
  missingName,
  missingBirthDate,
  missingOrder,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * scanBarcode
   */
  test('Expect scanBarcode to throw on missing file', async () => {
    try {
      await scanBarcode(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingFile.code);
    }
  });

  /**
   * newOpperation
   */
  test('Expect newOpperation to throw on missing dni', async () => {
    try {
      await newOpperation(undefined, 'gender', 'deviceIp', 'fingerprintData');
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });

  test('Expect newOpperation to throw on missing gender', async () => {
    try {
      await newOpperation('dni', undefined, 'deviceIp', 'fingerprintData');
    } catch (e) {
      expect(e.code).toMatch(missingGender.code);
    }
  });

  test('Expect newOpperation to throw on missing deviceIp', async () => {
    try {
      await newOpperation('dni', 'gender', undefined, 'fingerprintData');
    } catch (e) {
      expect(e.code).toMatch(missingDeviceIp.code);
    }
  });

  test('Expect newOpperation to throw on missing fingerprintData', async () => {
    try {
      await newOpperation('dni', 'gender', 'deviceIp', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingFingerprintData.code);
    }
  });

  /**
   * addFront
   */
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

  test('Expect addFront to throw on missing analyzeAnomalies', async () => {
    try {
      await addFront('dni', 'gender', 'operationId', 'frontImage', undefined, 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingAnalyzeAnomalies.code);
    }
  });

  test('Expect addFront to throw on missing analyzeOcr', async () => {
    try {
      await addFront('dni', 'gender', 'operationId', 'frontImage', 'analyzeAnomalies', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingAnalyzeOcr.code);
    }
  });

  /**
   * addBack
   */
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

  test('Expect addBack to throw on missing frontImage', async () => {
    try {
      await addBack('dni', 'gender', 'operationId', undefined, 'analyzeAnomalies', 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingBackImage.code);
    }
  });

  test('Expect addBack to throw on missing analyzeAnomalies', async () => {
    try {
      await addBack('dni', 'gender', 'operationId', 'backImage', undefined, 'analyzeOcr');
    } catch (e) {
      expect(e.code).toMatch(missingAnalyzeAnomalies.code);
    }
  });

  test('Expect addBack to throw on missing analyzeOcr', async () => {
    try {
      await addBack('dni', 'gender', 'operationId', 'backImage', 'analyzeAnomalies', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingAnalyzeOcr.code);
    }
  });

  /**
   * addSelfie
   */
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

  /**
   * addBarcode
   */
  test('Expect addBarcode to throw on missing dni', async () => {
    try {
      await addBarcode(undefined, 'gender', 'operationId', 'name', 'lastName', 'birthDate', 'order');
    } catch (e) {
      expect(e.code).toMatch(missingDni.code);
    }
  });

  test('Expect addBarcode to throw on missing gender', async () => {
    try {
      await addBarcode('dni', undefined, 'operationId', 'name', 'lastName', 'birthDate', 'order');
    } catch (e) {
      expect(e.code).toMatch(missingGender.code);
    }
  });

  test('Expect addBarcode to throw on missing operationId', async () => {
    try {
      await addBarcode('dni', 'gender', undefined, 'name', 'lastName', 'birthDate', 'order');
    } catch (e) {
      expect(e.code).toMatch(missingOperationId.code);
    }
  });

  test('Expect addBarcode to throw on missing name', async () => {
    try {
      await addBarcode('dni', 'gender', 'operationId', undefined, 'lastName', 'birthDate', 'order');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect addBarcode to throw on missing lastName', async () => {
    try {
      await addBarcode('dni', 'gender', 'operationId', 'name', undefined, 'birthDate', 'order');
    } catch (e) {
      expect(e.code).toMatch(missingLastName.code);
    }
  });

  test('Expect addBarcode to throw on missing birthDate', async () => {
    try {
      await addBarcode('dni', 'gender', 'operationId', 'name', 'lastName', undefined, 'order');
    } catch (e) {
      expect(e.code).toMatch(missingBirthDate.code);
    }
  });

  test('Expect addBarcode to throw on missing order', async () => {
    try {
      await addBarcode('dni', 'gender', 'operationId', 'name', 'lastName', 'birthDate', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOrder.code);
    }
  });

  /**
   * endOperation
   */
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
