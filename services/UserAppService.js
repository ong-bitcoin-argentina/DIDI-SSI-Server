const UserApp = require("../models/UserApp");
const UserService = require("./UserService");
const AppAuthService = require("./AppAuthService");
const {
	VALIDATION: { USER_APP_NOT_FOUND, DID_NOT_FOUND, APP_DID_NOT_FOUND }
} = require("../constants/Messages");

const findByUserDID = async function (userDid) {
	const user = await UserApp.getByDID(userDid);
	if (!user) throw USER_APP_NOT_FOUND(userDid);
	return user;
};

const createUser = async function (userDid, appDid) {
	const user = await UserService.getByDID(userDid);
	if (!user) throw DID_NOT_FOUND(did);

	const appAuth = await AppAuthService.findByDID(appDid);
	if (!appAuth) throw APP_DID_NOT_FOUND(did);

	const userId = user._id;
	const appAuthId = appAuth._id;

	return await UserApp.create({ userId, appAuthId });
};

module.exports = {
	findByUserDID,
	createUser
};
