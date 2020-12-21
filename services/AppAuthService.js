const AppAuth = require("../models/AppAuth");
const {
	VALIDATION: { APP_DID_NOT_FOUND }
} = require("../constants/Messages");

const findByDID = async function (did) {
	const app = await AppAuth.getByDID(did);
	if (!app) throw APP_DID_NOT_FOUND(did);
	return app;
};

const createApp = async function (did, name) {
	return await AppAuth.create({ did, name });
};

module.exports = {
	findByDID,
	createApp
};
