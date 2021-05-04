
const UserService = require("../../services/UserService");
const { userDTO } = require("../../utils/DTOs");
const ResponseHandler = require("../../utils/ResponseHandler");

const readUserByPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await UserService.getByTel(phone);
    if (!user) return ResponseHandler.sendErrWithStatus(res, { message: "User does not exist" }, 404);
    const result = await userDTO(user);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err, 500);
  }
}

module.exports = {
  readUserByPhone,
}