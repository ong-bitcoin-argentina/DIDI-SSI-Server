const Messages = require("../constants/Messages");
const Constants = require("../constants/Constants");
const firebaseAdmin = require("firebase-admin");
const credentialAccount = require("../firebase-admin.json");

firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(credentialAccount),
	databaseURL: Constants.FIREBASE_URL
});

// crear y mandar una push notification
module.exports.sendPushNotification = async function(title, message, firebaseId) {
	if (!firebaseId) return;

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
