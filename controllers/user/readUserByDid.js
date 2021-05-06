const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');
const { userDTO } = require('../../utils/DTOs');

const readUserByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const user = await UserService.findByDid(did);
    const result = await userDTO(user);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readUserByDid,
};
