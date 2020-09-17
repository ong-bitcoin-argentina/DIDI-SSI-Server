const AppAuth = require("../models/AppAuth");

const findByDID = async function (did) {
	return await AppAuth.getByDID(did);
};

const createApp = async function (did, name) {
	return await AppAuth.create({ did, name });
};

module.exports = {
	findByDID,
	createApp
};
