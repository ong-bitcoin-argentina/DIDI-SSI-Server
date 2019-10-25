let router = require("express").Router();
var UserService = require("../services/UserService");
var ResponseHandler = require("./ResponseHandler");

router.get("/", function(_, res) {
	return ResponseHandler.sendRes(res, "server up and running");
});

router.get("/users", function(_, res) {
	return UserService.getAll(
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.post("/user/login", function(req, res) {
	const name = req.body.user.name;
	const pass = req.body.user.pass;

	return UserService.login(
		name,
		pass,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.get("/user/:userId", function(req, res) {
	const userId = req.params.userId;

	return UserService.get(
		userId,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.post("/user", function(req, res) {
	const name = req.body.user.name;
	const pass = req.body.user.pass;

	return UserService.create(
		name,
		pass,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.put("/user/:userId", function(req, res) {
	const name = req.body.user.name;
	const userId = req.params.userId;

	return UserService.edit(
		userId,
		name,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

router.delete("/user/:userId", function(req, res) {
	let userId = req.params.userId;

	return UserService.delete(
		userId,
		data => {
			return ResponseHandler.sendRes(res, data);
		},
		err => {
			return ResponseHandler.sendErr(res, err);
		}
	);
});

module.exports = router;
