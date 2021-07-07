const { sendPushNotification } = require('../../../services/FirebaseService');
const {
  missingType, missingMessage, missingFirebaseId, missingTitle,
} = require('../../../constants/serviceErrors');

describe('services/Firebase/sendPushNotification.test.js', () => {
  test('Expect sendPushNotification to throw on missing title', async () => {
    try {
      await sendPushNotification(undefined, 'message', 'firebaseId', 'type');
    } catch (e) {
      expect(e.code).toMatch(missingTitle.code);
    }
  });
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
