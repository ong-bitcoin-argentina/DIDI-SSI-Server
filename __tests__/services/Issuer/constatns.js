const { issuers } = require('./issuers');

const data = {
  did: 'did:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee0',
  rskDid: 'did:ethr:rsk:0x36f6dc06d34b164aec5421c9071a0d07765d4ee0',
  key: '08c5c2d853de11b8a31da6048433f35d3ea966dd9dd558172ef2606a569eec03',
  secondDid: 'did:ethr:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
  name: 'Issuer Name',
  secondName: 'Issuer Second Name',
  callbackUrl: 'https://api.issuer.qa.didi.org.ar/api/1.0/didi_issuer/register',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGIwZmY3YzM5ZGYxYzAwMzkyNGUxNDgiLCJleHAiOjE2Mzk4NDcxODEsImlhdCI6MTYyNjg4NzE4MX0.dyBtCdKu6lHquDW5VX6q8jTcl2ZIXnq37AV1y1GLk5Y',
  action: 'CREATE',
  description: 'Descripcion del issuer',
  secondDescription: 'Otra descripcion para el issuer',
  file: {
    mimetype: 'image/jpeg',
    path: '__tests__/services/User/utils/image.jpg',
  },
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
