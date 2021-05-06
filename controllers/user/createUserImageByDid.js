/* eslint-disable max-len */
const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');
const { getImageUrl } = require('../../utils/Helpers');

const createUserImageByDid = async (req, res) => {
  try {
    const { path, mimetype, size } = req.file;
    const { did } = req.params;

    // MAX_MB * 1000000 da la cantidad exacta de los MB permitidos
    if (size > Constants.MAX_MB * 1000000) return ResponseHandler.sendErr(res, Messages.IMAGE.ERR.INVALID_SIZE);

    const { _id } = await UserService.saveImage(did, mimetype, path);
    const imageUrl = getImageUrl(_id);

    return ResponseHandler.sendRes(res, imageUrl);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createUserImageByDid,
};
