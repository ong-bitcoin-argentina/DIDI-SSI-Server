const { deleteShareRequest } = require('../../services/ShareRequestService');
const ResponseHandler = require('../../utils/ResponseHandler');

const deleteShareRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteShareRequest(id);
    return ResponseHandler.sendRes(res, deleted);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  deleteShareRequestById,
};
