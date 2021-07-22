const { addBarcode } = require('../../../services/RenaperService');
const {
  missingDni,
  missingGender,
  missingOperationId,
  missingName,
  missingLastName,
  missingBirthDate,
  missingOrder,
} = require('../../../constants/serviceErrors');

describe('services/Renaper/addBarcode.test.js', () => {
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
});
