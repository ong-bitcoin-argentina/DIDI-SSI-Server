const UserRonda = require("../models/UserRonda");
const UserService = require("./UserService");
const {
	VALIDATION: { USER_RONDA_NOT_FOUND, DID_NOT_FOUND }
} = require("../constants/Messages");

const findByUserDID = async function (did) {
	const user = await UserRonda.getByDID(did);
	if (!user) throw USER_RONDA_NOT_FOUND(did);
	return user;
};

const createUser = async function (did) {
	const user = await UserService.getByDID(did);
	if (!user) throw DID_NOT_FOUND(did);
	const userId = user._id;
	return await UserRonda.create({ userId, did });
};

module.exports = {
	findByUserDID,
	createUser
};
