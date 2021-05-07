const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');

const updateUserByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const { name, lastname } = req.body;
    const result = await UserService.findByDidAndUpdate(did, { name, lastname });
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  updateUserByDid,
};
