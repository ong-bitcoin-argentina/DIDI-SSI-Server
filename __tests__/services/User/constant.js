const UserService = require('../../../services/UserService');

const userData = {
  did: '0x36f6dc06d34b164aec5421c9071a0d07765d4ee0',
  privateKeySeed: '08c5c2d853de11b8a31da6048433f35d3ea966dd9dd558172ef2606a569eec03',
  userMail: 'test@test.com',
  phoneNumber: '+5412345678',
  userPass: '123456789',
  firebaseId: '',
  name: 'test',
  lastname: 'test',
};

const createUser = async (data) => {
  const {
    did,
    privateKeySeed,
    eMail,
    phoneNumber,
    password,
    firebaseId,
    name,
    lastname,
  } = data;
  const user = await UserService.create(
    did,
    privateKeySeed,
    eMail,
    phoneNumber,
    password,
    firebaseId,
    name,
    lastname,
  );
  return user;
};

const user = createUser(userData);

module.exports = {
  user,
  userData,
};
