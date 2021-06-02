const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');

const readUserImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { img, contentType } = await UserService.getImage(id);
    res.type(contentType);
    return res.send(img);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readUserImageById,
};
