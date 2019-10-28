class ResponseHandler {
	static sendHtml(res, data) {
		res.type("text/html; charset=UTF-8");
		res.write(data);
		return res.end();
	}

	static sendRes(res, data) {
		res.type("application/json; charset=UTF-8");
		return res.json({
			status: "success",
			data: data
		});
	}

	static sendErr(res, err) {
		res.type("application/json; charset=UTF-8");
		return res.json({
			status: "error",
			errorCode: err.code,
			message: err.message
		});
	}
}

module.exports = ResponseHandler;
