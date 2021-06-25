const email = 'test@test.io';
const code = '123456';
const did = 'did:ethr:0x31234E4CF6c075000024A954EC1D1B12bDcb1234';
const req = {
  body: {
    eMail: email,
  },
};

const res = {
  type: jest.fn(),
  // data: jest.fn(),
  // end: jest.fn(),
  json: jest.fn(),
};

module.exports = {
  email,
  req,
  res,
  code,
  did,
};
