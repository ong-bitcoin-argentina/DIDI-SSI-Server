const { newOpperation } = require('../../../services/RenaperService');
const {
  missingDni, missingGender, missingDeviceIp, missingFingerprintData,
} = require('../../../constants/serviceErrors');

describe('services/Renaper/scanBarcode.test.js', () => {
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
});
