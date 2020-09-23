const UserApp = require("../models/UserApp");
const UserService = require("./UserService");
const AppAuthService = require("./AppAuthService");
const { getPayload, verifyToken } = require("./TokenService");
const { userDTO } = require("../routes/utils/DTOs");
const {
	VALIDATION: { DID_NOT_FOUND, APP_DID_NOT_FOUND },
	USER_APP: { NOT_FOUND }
} = require("../constants/Messages");

const findByUserDID = async function (userDid) {
	const user = await UserApp.getByDID(userDid);
	if (!user) throw NOT_FOUND(userDid);
	return user;
};

const createByTokens = async function (userToken, appToken) {
	await verifyToken(userToken, true);

	const userPayload = getPayload(userToken);
	const appPayload = getPayload(appToken);

	const userDid = userPayload.iss;
	const appDid = appPayload.iss;

	const { user, appAuth } = await createUser(userDid, appDid);
	const niceUser = await userDTO(user);
	return { ...niceUser, appName: appAuth.name };
};

const createUser = async function (userDid, appDid) {
	const user = await UserService.getByDID(userDid);
	if (!user) throw DID_NOT_FOUND(userDid);

	const appAuth = await AppAuthService.findByDID(appDid);
	if (!appAuth) throw APP_DID_NOT_FOUND(appDid);

	const userId = user._id;
	const appAuthId = appAuth._id;

	await UserApp.generate(userId, appAuthId);

	return { user, appAuth };
};

module.exports = {
	createByTokens,
	findByUserDID
};
