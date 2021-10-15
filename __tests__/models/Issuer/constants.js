const { Credentials } = require('uport-credentials');

const issuers = [{
  deleted: false,
  createdOn: { date: '2021-07-06T15:55:29.432Z' },
  name: 'Issuer Travis test',
  did: 'did:ethr:0x36f6dc06d34b164aec5421c9071a0d07765d4ee0',
  expireOn: { date: '2024-06-28T16:20:30.373Z' },
  blockHash: '0x0392b8b2af982a05b56f8cf2809598ba5cd41ed1a3890868d077a3bf117abb31',
  __v: 0,
  description: 'Issuer para los test de travis',
  modifiedOn: { date: '2021-07-27T12:55:13.717Z' },
  imageUrl: '6100023190c0393938665f90',
},
{
  deleted: false,
  createdOn: { date: '2021-07-06T15:55:29.432Z' },
  name: 'Issuer Travis test',
  did: 'did:ethr:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
  expireOn: { date: '2024-06-28T16:20:30.373Z' },
  blockHash: '0x0392b8b2af982a05b56f8cf2809598ba5cd41ed1a3890868d077a3bf117abb31',
  __v: 0,
  description: 'Issuer para los test de travis',
  modifiedOn: { date: '2021-07-27T12:55:13.717Z' },
}];

const delegationHashes = [
  {
    network: 'lacchain',
    transactionHash: '0xc653efa2d9712cde6e6d86de0997327c35f1fa76595f3d543cd30fb0ffbd261a',
  },
  {
    network: 'rsk',
    transactionHash: '0x664614fd64248497003f050c1fcc0da4653cb4c08f0a761c59a7b03821d0b30e',
  },
];

const newIssuer = Credentials.createIdentity();
const expireOn = Date.now() / 1000 + 500;
const name = 'issueewrwefwrName';
const description = 'description';
const imageUrl = 'url';

const data = {
  newIssuer,
  expireOn,
  name,
  description,
  imageUrl,
};

module.exports = {
  issuers,
  data,
  delegationHashes,
};
