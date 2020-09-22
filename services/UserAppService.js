const UserApp = require("../models/UserApp");
const UserService = require("./UserService");
const AppAuthService = require("./AppAuthService");
const { userDTO } = require("../routes/utils/DTOs");
const { decodeJWT } = require("did-jwt");
const {
	VALIDATION: { USER_APP_NOT_FOUND, DID_NOT_FOUND, APP_DID_NOT_FOUND }
} = require("../constants/Messages");

const findByUserDID = async function (userDid) {
	const user = await UserApp.getByDID(userDid);
	if (!user) throw USER_APP_NOT_FOUND(userDid);
	return user;
};

const createByTokens = async function (userToken, appToken) {
	const userPayload = decodeJWT(userToken).payload;
	const appPayload = decodeJWT(appToken).payload;

	const userDid = userPayload.iss;
	const appDid = appPayload.iss;

	const user = await createUser(userDid, appDid);
	return userDTO(user);
};

const createUser = async function (userDid, appDid, returnUser = true) {
	const user = await UserService.getByDID(userDid);
	if (!user) throw DID_NOT_FOUND(userDid);

	const appAuth = await AppAuthService.findByDID(appDid);
	if (!appAuth) throw APP_DID_NOT_FOUND(appDid);

	const userId = user._id;
	const appAuthId = appAuth._id;

	const userApp = await UserApp.create({ userId, appAuthId });
	return returnUser ? user : userApp;
};

module.exports = {
	createByTokens,
	findByUserDID
};
