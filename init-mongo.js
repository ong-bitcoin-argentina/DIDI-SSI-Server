const MONGO_INITDB_DATABASE = "didi";
const MONGO_USERNAME = "didi_admin";
const MONGO_PASSWORD = "***REMOVED***";

db.createUser({
	user: "didi_admin",
	pwd: "***REMOVED***",
	roles: [
		{
			role: "readWrite",
			db: "didi"
		}
	]
});
