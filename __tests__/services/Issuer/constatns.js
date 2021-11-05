const { issuers } = require('./issuers');

const data = {
  allNetworksDid: 'did:ethr:0xd98cdaac3f682ca2fb72fbad3090a22462290037',
  did: 'did:ethr:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
  lacchainDid: 'did:ethr:rsk:0x36f6dc06d34b164aec5421c9071a0d07765d4ee0',
  rskDid: 'did:ethr:rsk:0x36f6dc06d34b164aec5421c9071a0d07765d4ee0',
  key: '08c5c2d853de11b8a31da6048433f35d3ea966dd9dd558172ef2606a569eec03',
  secondDid: 'did:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee2',
  name: 'Issuer Name',
  secondName: 'Issuer Second Name',
  callbackUrl: 'https://api.issuer.qa.didi.org.ar/register',
  action: 'CREATE',
  description: 'Descripcion del issuer',
  secondDescription: 'Otra descripcion para el issuer',
  file: {
    mimetype: 'image/jpeg',
    path: '__tests__/services/User/utils/image.jpg',
  },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTIxZTY1NjVjYTVlYjAwMzgwZjBkOTUiLCJleHAiOjE2NDMzMDIwNjYsImlhdCI6MTYzMDM0MjA2Nn0.poZ_USLMiABjSdbdnPPFV0VeycWcA8EowAX8jbsypzc',
};

const pagination = {
  limit: 1,
  page: 2,
};

const successBody = {
  status: 'success',
  data: {
    _id: '60f96e6e1e4ea500368721cb',
    did: data.did,
    name: data.name,
    createdOn: '2021-07-22T13:11:10.623Z',
    status: 'Creado',
    messageError: 'Error',
    blockchain: 'rsk',
  },
};

const failureBody = {
  status: 'fail',
  data: {},
};

module.exports = {
  data,
  issuers,
  pagination,
  successResp: {
    json: () => successBody,
  },
  failureResp: {
    json: () => failureBody,
  },
};
