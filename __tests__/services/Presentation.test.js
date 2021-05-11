const { savePresentation, getPresentation } = require('../../services/PresentationService');
const {
  missingJwt, missingId,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  test('Expect savePresentation to throw on missing jwts', async () => {
    try {
      await savePresentation({ jwts: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect getPresentation to throw on missing id', async () => {
    try {
      await getPresentation({ id: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });
});
