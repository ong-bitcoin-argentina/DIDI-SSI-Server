const AuthRequestService = require("../../services/AuthRequestService");
const SemillasService = require("../../services/SemillasService");
const UserService = require("../../services/UserService");
const { userDTO } = require("../../utils/DTOs");
const ResponseHandler = require("../../utils/ResponseHandler");

const readUserByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const user = await UserService.findByDid(did);
    if (!user) return ResponseHandler.sendErrWithStatus(res, { message: "User does not exist" }, 404);

    const renaper = await AuthRequestService.getByDID(did);

    let semillas;
    try {
      semillas = await SemillasService.getValidation(did);
    } catch (e) {
      semillas = null;
    }

    const result = await userDTO(user, { renaper, semillas });
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err, 500);
  }
}

module.exports = {
  readUserByDid,
}