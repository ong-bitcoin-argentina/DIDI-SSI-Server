const data = {
  did: 'did:ethr:0x36f6dc06d34b164aec5421c9071a0d07765d4ee0',
  phoneNumber: '+5412345678',
  callback: 'callback',
  claims: {
    claim: 'claim',
  },
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
