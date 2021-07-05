const { sendPushNotification } = require('../../services/FirebaseService');
const {
  missingType, missingMessage, missingFirebaseId,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  test('Expect sendPushNotification to throw on missing message', async () => {
    try {
      await sendPushNotification('title', undefined, 'firebaseId', 'type');
    } catch (e) {
      expect(e.code).toMatch(missingMessage.code);
    }
  });

  test('Expect sendPushNotification to throw on missing firebaseId', async () => {
    try {
      await sendPushNotification('title', 'message', undefined, 'type');
    } catch (e) {
      expect(e.code).toMatch(missingFirebaseId.code);
    }
  });

  test('Expect sendPushNotification to throw on missing type', async () => {
    try {
      await sendPushNotification('title', 'message', 'firebaseId', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingType.code);
    }
  });
});
