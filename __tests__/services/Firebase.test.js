const { sendPushNotification } = require('../../services/FirebaseService');
const {
  missingFirebaseId,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  test('Expect sendPushNotification to throw on missing firebaseId', async () => {
    try {
      await sendPushNotification('title', 'message', undefined, 'type');
    } catch (e) {
      expect(e.code).toMatch(missingFirebaseId.code);
    }
  });
});
