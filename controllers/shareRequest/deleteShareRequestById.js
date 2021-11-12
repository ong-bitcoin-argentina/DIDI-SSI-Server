const { deleteShareRequest } = require('../../services/ShareRequestService');
const ResponseHandler = require('../../utils/ResponseHandler');

const deleteShareRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const { _id } = await deleteShareRequest(id);
    return ResponseHandler.sendRes(res, _id);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  deleteShareRequestById,
};
