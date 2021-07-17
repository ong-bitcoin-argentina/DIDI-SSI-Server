const { Credentials } = require('uport-credentials');

const rsk = Credentials.createIdentity();
const lacchain = Credentials.createIdentity();
const bfa = Credentials.createIdentity();

module.exports = {
  data: {
    issuerDIDRsk: `did:ethr:rsk:${rsk.did}`,
    issuerDIDLacch: `did:ethr:lacchain:${lacchain.did}`,
    issuerDIDBfa: `did:ethr:bfa:${bfa.did}`,
    invalidIssuerDID: 'did:ethr:0xb7123',
  },
};
