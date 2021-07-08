const { getHash } = require('../../../services/MouroService');
const { missingDid } = require('../../../constants/serviceErrors');
const { appData } = require('./constants');

describe('services/Mouro/getHash.test.js', () => {
  test('Expect getHash to throw on missing did', async () => {
    try {
      await getHash(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
});
