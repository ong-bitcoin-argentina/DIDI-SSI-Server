const ResponseHandler = require('../../utils/ResponseHandler');
const IssuerService = require('../../services/IssuerService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');

const { CREATE } = Constants.DELEGATE_ACTIONS;

const createDelegation = async (req, res) => {
  const {
    did, name, callbackUrl, token, description,
  } = req.body;
  let file;
  if (req.file) {
    file = {
      path: req.file.path,
      mimeype: req.file.mimetype,
    };
  }

  try {
    const didExist = await IssuerService.getIssuerByDID(did);
    if (didExist) throw Messages.ISSUER.ERR.DID_EXISTS;
    const delegateTransaction = await IssuerService.createDelegateTransaction({
      did,
      name,
      description,
      callbackUrl,
      token,
      action: CREATE,
      file: req.file ? file : null,
    });

    return ResponseHandler.sendRes(res, delegateTransaction);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErrWithStatus(res, err, 403);
  }
};

module.exports = {
  createDelegation,
};
