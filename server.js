let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

let Constants = require("./constants/Constants");
let Messages = require("./constants/Messages");

let UserRoutes = require("./routes/UserRoutes");

let app = express();

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(bodyParser.json());

console.log(Messages.INDEX.MSG.CONNECTING + Constants.MONGO_URL);

mongoose
	.connect(Constants.MONGO_URL, {
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

// log calls
app.use(function(req, _, next) {
	console.log(req.method + " " + req.originalUrl);
	process.stdout.write("body: ");
	console.log(req.body);
	console.log();
	next();
});

// log errors
app.use(function(error, _, _, next) {
	console.log(error);
	next();
});

app.use("/api", UserRoutes);

app.listen(Constants.PORT, function() {
	console.log(Messages.INDEX.MSG.RUNNING_ON + Constants.PORT);
});
