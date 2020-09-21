module.exports = (req, res, next) => {
	if (!process.env.ENABLE_INSECURE_ENDPOINTS) {
		throw new Error("Disabled endpoint");
	}
	next();
};
