const { saveShareRequest, getShareRequestById } = require('../../services/ShareRequestService');
const {
  missingJwt, missingId, missingUserJWT
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
    /**
  * saveShareRequest
  */
  test('Expect saveShareRequest to throw on missing jwt', async () => {
    try {
      await saveShareRequest({undefined});
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
  /**
  * getShareRequestById
  */
  test('Expect getShareRequestById to throw on missing id', async () => {
    try {
      await getShareRequestById({id:undefined, userJWT:'userJWT'});
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });

  test('Expect getShareRequestById to throw on missing userJWT', async () => {
   try {
      await getShareRequestById({id:'id', userJWT:undefined});
    } catch (e) {
      expect(e.code).toMatch(missingUserJWT.code);
    }
  });
});
