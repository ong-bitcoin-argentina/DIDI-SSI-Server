const { getPresentation } = require('../../../services/PresentationService');
const {
   missingId,
} = require('../../../constants/serviceErrors');

describe('services/Presentation/getPresentation.test.js', () => {

  test('Expect getPresentation to throw on missing id', async () => {
    try {
      await getPresentation({ id: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });
});
