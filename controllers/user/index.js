const { createUser } = require('./createUser');
const { updateFirebaseId } = require('./updateFirebaseId');
const { readPrivateKey } = require('./readPrivateKey');
const { updateUserFirebaseId } = require('./updateUserFirebaseId');
const { recoverPassword } = require('./recoverPassword');
const { updatePassword } = require('./updatePassword');
const { updatePhoneNumber } = require('./updatePhoneNumber');
const { updateEmail } = require('./updateEmail');
const { createCredentialPetition } = require('./createCredentialPetition');
const { updateCredentialPetition } = require('./updateCredentialPetition');
const { readUserByDid } = require('./readUserByDid');
const { updateUserByDid } = require('./updateUserByDid');
const { createUserImageByDid } = require('./createUserImageByDid');
const { readUserImageById } = require('./readUserImageByDid');

module.exports = {
  createUser,
  updateFirebaseId,
  readPrivateKey,
  updateUserFirebaseId,
  recoverPassword,
  updatePassword,
  updatePhoneNumber,
  updateEmail,
  createCredentialPetition,
  updateCredentialPetition,
  readUserByDid,
  updateUserByDid,
  createUserImageByDid,
  readUserImageById,
};
