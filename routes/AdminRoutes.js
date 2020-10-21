const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const UserService = require("../services/UserService");

const { userDTO } = require("./utils/DTOs");
const { validateAdminJWT } = require("../middlewares/ValidateAdminJWT");

const Validator = require("./utils/Validator");

router.use("/admin/", validateAdminJWT);

/**
 *	Obtiene informacion confidencial sobre el usuario (incluye status de renaper y de semillas)
 */
router.get("/admin/:did", Validator.checkValidationResult, Validator.validateParams, async function (req, res) {
	try {
		const { did } = req.params;
		const user = await UserService.findByDid(did);
		const result = await userDTO(user);
		return ResponseHandler.sendRes(res, result);
	} catch (err) {
		return ResponseHandler.sendErrWithStatus(res, err, 500);
	}
});

module.exports = router;