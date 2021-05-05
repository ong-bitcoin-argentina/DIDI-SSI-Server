const ResponseHandler = require('../../utils/ResponseHandler');
const MailService = require('../../services/MailService');
const Messages = require('../../constants/Messages');

const retryMailVerification = async (req, res) => {
    const eMail = req.body.eMail.toLowerCase();

    try {
      const mail = await MailService.getByMail(eMail);

      // Mandar mail con código de validación
      await MailService.sendValidationCode(eMail, mail.code);

      return ResponseHandler.sendRes(res, Messages.EMAIL.SUCCESS.SENT);
    } catch (err) {
      return ResponseHandler.sendErr(res, err);
    }
};

module.exports = {
    retryMailVerification,
};