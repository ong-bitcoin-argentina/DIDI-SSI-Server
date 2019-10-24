const MONGO_DIR = process.env.MONGO_DIR || "127.0.0.1"; // "mongo" on docker
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const PORT = process.env.PORT || 3000;

module.exports = {
	MONGO_URL: "mongodb://" + MONGO_DIR + ":" + MONGO_PORT + "/didi",
	PORT: PORT
};
