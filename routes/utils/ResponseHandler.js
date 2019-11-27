const Constants = require("../../constants/Constants");

module.exports.sendHtml = function(res, data) {
	res.type("text/html; charset=UTF-8");
	res.write(data);
	return res.end();
};

module.exports.sendRes = function(res, data) {
	res.type("application/json; charset=UTF-8");
	// if (Constants.DEBUGG) console.log(data);
	return res.json({
		status: "success",
		data: data
	});
};

module.exports.sendErr = function(res, err) {
	if (Constants.DEBUGG) console.log(err);

	res.type("application/json; charset=UTF-8");
	return res.json({
		status: "error",
		errorCode: err.code,
		message: err.message
	});
};
