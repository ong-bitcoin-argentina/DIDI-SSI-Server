const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const Constants = require("./constants/Constants");
const Messages = require("./constants/Messages");

const UserRoutes = require("./routes/UserRoutes");
const SmsRoutes = require("./routes/SmsRoutes");
const MailRoutes = require("./routes/MailRoutes");

const app = express();

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(bodyParser.json());

if (Constants.DEBUGG) console.log(Messages.INDEX.MSG.CONNECTING + Constants.MONGO_URL);

mongoose
	.connect(Constants.MONGO_URL, {
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
	.then(() => console.log(Messages.INDEX.MSG.CONNECTED))
	.catch(err => {
		console.log(Messages.INDEX.ERR.CONNECTION + err.message);
	});

var db = mongoose.connection;
if (!db) console.log(Messages.INDEX.ERR.DB_CONNECTION);
else console.log(Messages.INDEX.MSG.DB_CONNECTED);

app.get("/", (_, res) => res.send(Messages.INDEX.MSG.HELLO_WORLD));

app.use(bodyParser.json());

// log calls
app.use(function(req, _, next) {
	if (Constants.DEBUGG) {
		console.log(req.method + " " + req.originalUrl);
		process.stdout.write("body: ");
		console.log(req.body);
		console.log();
	}
	next();
});

// log errors
app.use(function(error, _, _, next) {
	console.log(error);
	next();
});

const route = "/api/" + Constants.API_VERSION + "/didi";
if (Constants.DEBUGG) {
	console.log("route: " + route);
}

app.use(route, UserRoutes);
app.use(route, SmsRoutes);
app.use(route, MailRoutes);

app.listen(Constants.PORT, function() {
	console.log(Messages.INDEX.MSG.RUNNING_ON + Constants.PORT);
});
