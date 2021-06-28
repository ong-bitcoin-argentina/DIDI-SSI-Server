const { savePresentation, getPresentation } = require('../../../services/PresentationService');
const {
  missingJwt, missingId,
} = require('../../constants/serviceErrors');

describe('services/AppAuth/getPresentation.test.js', () => {

  test('Expect getPresentation to throw on missing id', async () => {
    try {
      await getPresentation({ id: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });
});
