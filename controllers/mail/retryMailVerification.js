const MailService = require('../../services/MailService');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');
const CodeGenerator = require('../../utils/CodeGenerator');
const ResponseHandler = require('../../utils/ResponseHandler');

const retryMailVerification = async (req, res) => {
  const eMail = req.body.eMail.toLowerCase();
  try {
    await MailService.getByMail(eMail);
    const code = CodeGenerator.generateCode(Constants.RECOVERY_CODE_LENGTH);
    if (Constants.DEBUGG) {
      // eslint-disable-next-line no-console
      console.log(code);
    }
    await MailService.create(eMail, code, undefined);
    await MailService.sendValidationCode(eMail, code);
    return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  retryMailVerification,
};
