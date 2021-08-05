const { scanBarcode } = require('../../../services/RenaperService');
const { missingFile } = require('../../../constants/serviceErrors');

describe('services/Renaper/scanBarcode.test.js', () => {
  test('Expect scanBarcode to throw on missing file', async () => {
    try {
      await scanBarcode(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingFile.code);
    }
  });
});
