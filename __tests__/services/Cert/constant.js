const Constants = require('../../../constants/Constants');

const data = {
  did: 'did:ethr:0x36f6dc06d34b164aec5421c9071a0d07765d4ee0',
  issuerDid: Constants.SERVER_DID,
  phoneNumber: '+5412345678',
  mail: 'mail@mail.com',
  callback: 'callback',
  claims: {
    claim: 'claim',
  },
  jwt: 'asdasd',
};

module.exports = {
  data,
  algo: {
    Email: {
      preview: {
        type: 0,
        fields: [Array],
      },
      category: 'identity',
      data: { email: 'silviaox@gmail.com' },
    },
  },
};
