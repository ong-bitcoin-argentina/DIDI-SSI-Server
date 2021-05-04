const Constants = require("../../constants/Constants");

/**
 *  Mandar respuesta html genérica
 */
module.exports.sendHtml = function(res, data) {
	res.type("text/html; charset=UTF-8");
	res.write(data);
	return res.end();
};

/**
 *  Mandar respuesta exitosa genérica
 */
module.exports.sendRes = function(res, data) {
	res.type("application/json; charset=UTF-8");
	return res.json({
		status: "success",
		data: data
	});
};

/**
 *  Mandar respuesta de error genérica
 */
module.exports.sendErr = function(res, err) {
	if (Constants.DEBUGG && err) console.log(err);

	res.type("application/json; charset=UTF-8");
	return res.json({
		status: "error",
		errorCode: err && err.code,
		message: err && err.message
	});
};

/**
 *  Mandar respuesta de error con status custom
 */
module.exports.sendErrWithStatus = function(res, err, status = 500) {
	if (Constants.DEBUGG && err) console.log(err);
	return res.status(status).json({
		status: "error",
		errorCode: err.code,
		message: err.message
	});
}
