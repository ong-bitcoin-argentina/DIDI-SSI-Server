const User = require('../../../models/User');
const AppAuth = require('../../../models/AppAuth');
const { userData } = require('./constants');

const createUser = async (did) => {
  const {
    seed, mail, phoneNumber, pass, firebaseId, name, lastname,
  } = userData;
  const user = await User.generate(
    did,
    seed,
    mail,
    phoneNumber,
    pass,
    firebaseId,
    name,
    lastname,
  );
  return user;
};

const createAppAuth = async (data) => {
  const appAuth = await AppAuth.create(data);
  return appAuth;
};

module.exports = {
  createUser,
  createAppAuth,
};
