const { getShareRequestById } = require('../../../services/ShareRequestService');
const {
  missingId, missingUserJWT,
} = require('../../../constants/serviceErrors');

describe('__tests__/services/ShareRequest/readShareRequestById.test.js', () => {
  test('Expect getShareRequestById to throw on missing id', async () => {
    try {
      await getShareRequestById({ id: undefined, userJWT: 'userJWT' });
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect getShareRequestById to throw on missing userJWT', async () => {
    try {
      await getShareRequestById({ id: 'id', userJWT: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingUserJWT.code);
    }
  });
});
