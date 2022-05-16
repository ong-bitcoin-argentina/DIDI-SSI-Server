const validShareReq = {
  iat: 33,
  callback: 'callback',
  type: 'shareReq',
  claims: {
    verifiable: {
      mobilePhone: {
        essential: true,
        issuers: [
          {
            did: 'did:web:idverifier.claims',
            url: 'https://idverifier.example',
          },
        ],
        reason: 'To legally be able to send you a text',
      },
    },
  },
  aud: '0xaud',
  iss: 'did:ethr:firmante',
};

const invalidShareReq = {
  iat: 33,
  callback: 'callback',
  type: 'shareReq',
  aud: '0xaud',
  iss: 'did:ethr:firmante',
};

module.exports = {
  validShareReq,
  invalidShareReq,
};
