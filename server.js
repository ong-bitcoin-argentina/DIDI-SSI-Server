const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const Constants = require("./constants/Constants");
const Messages = require("./constants/Messages");

const IssuerRoutes = require("./routes/IssuerRoutes");
const UserRoutes = require("./routes/UserRoutes");
const SmsRoutes = require("./routes/SmsRoutes");
const MailRoutes = require("./routes/MailRoutes");
const RenaperRoutes = require("./routes/RenaperRoutes");

// set up node module clusters - one worker per CPU available
var cluster = require("cluster");
var numCPUs = require("os").cpus().length;

const app = express();
var http = require("http");
var server = http.createServer(app);

const log = console.log;
console.log = function(data) {
	log(new Date().toISOString() + ": ");
	log(data);
	log();
};

//Set Request Size Limit
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

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

app.get("/", (_, res) => res.send(Messages.INDEX.MSG.HELLO_WORLD));

app.use(bodyParser.json());

// log calls
app.use(function(req, _, next) {
	if (Constants.DEBUGG) {
		console.log(req.method + " " + req.originalUrl);
		process.stdout.write("body: ");
		console.log(req.body);
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

app.use(route, IssuerRoutes);
app.use(route, UserRoutes);
app.use(route, SmsRoutes);
app.use(route, MailRoutes);
app.use(route, RenaperRoutes);

if (cluster.isMaster) {
	console.log(Messages.INDEX.MSG.STARTING_WORKERS(numCPUs));

	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("online", function(worker) {
		console.log(Messages.INDEX.MSG.STARTED_WORKER(worker.process.pid));
	});

	cluster.on("exit", function(worker, code, signal) {
		console.log(Messages.INDEX.MSG.ENDED_WORKER(worker.process.pid, code, signal));
		console.log(Messages.INDEX.MSG.STARTING_WORKER);
		cluster.fork();
	});
} else {
	server.listen(Constants.PORT);
	console.log(Messages.INDEX.MSG.RUNNING_ON + Constants.PORT);
}
