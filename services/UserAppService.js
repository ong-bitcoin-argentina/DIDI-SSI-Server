const UserApp = require("../models/UserApp");
const UserService = require("./UserService");
const AppAuthService = require("./AppAuthService");
const CertService = require("./CertService");
const { getPayload } = require("./TokenService");
const { userDTO } = require("../routes/utils/DTOs");
const {
	VALIDATION: { DID_NOT_FOUND, APP_DID_NOT_FOUND },
	USER_APP: { NOT_FOUND },
	TOKEN: { INVALID_CODE }
} = require("../constants/Messages");

const findByUserDID = async function (userDid) {
	const user = UserService.getByDID(userDid);
	if (!user) throw DID_NOT_FOUND(userDid);

	const userApp = await UserApp.getByDID(userDid);
	if (!userApp) throw NOT_FOUND(userDid);

	return userApp;
};

const createByTokens = async function (userToken, appToken) {
	const verified = await CertService.verifyCertificate(userToken);
	if (!verified.payload) throw INVALID_CODE(true);

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

	const userApp = await UserApp.getOrCreate(userId, appAuthId);

	return { appAuth, user, userApp };
};

module.exports = {
	createByTokens,
	findByUserDID
};
