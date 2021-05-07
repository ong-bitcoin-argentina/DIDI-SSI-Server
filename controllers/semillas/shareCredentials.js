const SemillasService = require('../../services/SemillasService');
const ResponseHandler = require('../../utils/ResponseHandler');
const Messages = require('../../constants/Messages');

const { SUCCESS } = Messages.SEMILLAS;

const shareCredentials = async (req, res) => {
  try {
    const data = req.body;
    await SemillasService.shareData(data);
    return ResponseHandler.sendRes(res, SUCCESS.SHARE_DATA);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  shareCredentials,
};
