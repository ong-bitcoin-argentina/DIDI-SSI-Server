const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const firebaseAdmin = require("firebase-admin");

function hasFirebaseInEnv() {
	return Constants.FIREBASE_URL && Constants.FIREBASE_PRIV_KEY_PATH;
}

if (hasFirebaseInEnv()) {
	const credentialAccount = require(Constants.FIREBASE_PRIV_KEY_PATH);
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(credentialAccount),
		databaseURL: Constants.FIREBASE_URL
	});
}

// crear y mandar una push notification
module.exports.sendPushNotification = async function(title, message, firebaseId, type) {
	if (!hasFirebaseInEnv() || !firebaseId) return;

	const msg = {
		notification: {
			title: title,
			body: message
		},
		token: firebaseId,
		data: { notificationType: type }
	};

	try {
		console.log("sent");
		const response = await firebaseAdmin.messaging().send(msg);
		console.log(response);
		return Promise.resolve(response);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.COMMUNICATION_ERROR);
	}
};
