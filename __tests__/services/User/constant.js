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
};

module.exports = {
  userData,
  secondDid,
  errors,
};
