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

const mouroResponse = {
  data: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE2MjgxNzI1MjcsInN1YiI6ImRpZDpldGhyOjB4YzU0ZThmNTI2YzI4ODBlZjQ1NGVlOTU1MmVlNWY2MGE4OWYxODIwZSIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsic3ViamVjdCI6IiJ9fSwiaXNzIjoiZGlkOmV0aHI6MHg3Nzc0YTMzZjBhMGM4MTBjYTA3OTQwNzQyNWE4ZmI1MGNjNGRkZTE0In0.qYECICu_K2E5FSTY570QnyCTbOeq3KWW5yF-1Yf5sZxLFLyTOXvRab3UrTjIfv-I1bET-bJWqqLrIGbInKtX4gE',
  hash: '78d14754a24ccebe0825e61b110873d7317eda42948e76b159c5e8d599df70ee6a96c41ec3296304b91d658c1baafe3a9fe966a5bf35b1e8f59a6e47d3d2764a',
};

module.exports = {
  data,
  mouroResponse,
};
