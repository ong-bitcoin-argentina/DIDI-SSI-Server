const userData = {
  did: 'did:ethr:0x36f6dc06d34b164aec5421c9071a0d07765d4ee0',
  privateKeySeed: '08c5c2d853de11b8a31da6048433f35d3ea966dd9dd558172ef2606a569eec03',
  userMail: 'test@test.com',
  phoneNumber: '+5412345678',
  userPass: '123456789',
  firebaseId: '123456',
  name: 'test',
  lastname: 'test',
};
const secondDid = 'did:ethr:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1';

const errors = {
  missingDid: {
    code: 'DID_NOT_FOUND',
    message: `El usuario con el DID ${secondDid} no existe.`,
  },
  notMatchingDid: {
    code: 'NOMATCH_USER_DID',
    message: 'No se encontró ningún usuario con ese did, por favor verifique que sea correcto antes de volver a intentarlo.',
  },
  invalidPassword: {
    code: 'INVALID_USER',
    message: 'El usuario y contraseña no coinciden, por favor, verifique los valores antes de intentarlo nuevamente.',
  },
  emailTaken: {
    code: 'EMAIL_TAKEN',
    message: 'Ese mail ya se encuentra en uso, por favor elija otro.',
  },
  telTaken: {
    code: 'TEL_TAKEN',
    message: 'Ese teléfono ya se encuentra en uso, por favor elija otro.',
  },
  existingUser: {
    code: 'USER_ALREADY_EXIST',
    message: "Ese did ya se encuentra asociado a un usuario, si desea utilizar una cuenta ya existente, por favor dirigirse a 'Recuperar Cuenta'.",
  },
  invalidLogin: {
    code: 'INVALID_LOGIN',
    message: 'No se encontró ese usuario: email o contraseña incorrecta. (si no recuerda su contraseña, vaya atrás y haga click en recuperar cuenta > No recuerdo la contraseña)',
  },
  noMatchUserMail: {
    code: 'NOMATCH_USER_EMAIL',
    message: 'No se encontró ningún usuario con ese mail y contraseña, por favor, verifique los valores antes de intentarlo nuevamente.',
  },
  noMatchUserDid: {
    code: 'NOMATCH_USER_DID',
    message: 'No se encontró ningún usuario con ese did, por favor verifique que sea correcto antes de volver a intentarlo.',
  },
  getUser: {
    code: 'USER_GET',
    message: 'No se pudo obtener el usuario, por favor inténtelo de nuevo más tarde.',
  },
  invalidPhoneNumber: 'Numero de teléfono invalido',
};

module.exports = {
  userData,
  secondDid,
  errors,
};
