const ResponseHandler = require('../../utils/ResponseHandler');
const UserService = require('../../services/UserService');

const readPrivateKey = async (req, res) => {
  const eMail = req.body.eMail.toLowerCase();
  const { password } = req.body;
  const firebaseId = req.body.firebaseId ? req.body.firebaseId : '';

  try {
    // Compara contraseña y retorna clave privada
    const seed = await UserService.recoverAccount(eMail, password, firebaseId);
    return ResponseHandler.sendRes(res, { privateKeySeed: seed });
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readPrivateKey,
};
