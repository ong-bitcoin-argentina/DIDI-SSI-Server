const MONGO_DB = "didi";
const MONGO_USERNAME = "didi_admin";
const MONGO_PASSWORD = "uIERvZXMiLCJpYXQiOjE1MTYyMzkwMjJ9";

db.createUser({
	user: MONGO_USERNAME,
	pwd: MONGO_PASSWORD,
	roles: [
		{
			role: "readWrite",
			db: MONGO_DB
		}
	]
});
