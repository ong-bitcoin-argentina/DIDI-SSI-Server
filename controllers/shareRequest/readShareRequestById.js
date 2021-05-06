const { getShareRequestById } = require('../../services/ShareRequestService');
const ResponseHandler = require('../../utils/ResponseHandler');

const readShareRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userJWT } = req.body;
    const jwt = await getShareRequestById({ id, userJWT });
    res.type('text');
    return res.send(jwt);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readShareRequestById,
};
