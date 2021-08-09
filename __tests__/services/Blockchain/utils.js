const { Credentials } = require('uport-credentials');
const { addIssuer } = require('../../../services/IssuerService');

const addIssuers = async () => {
  const rsk = Credentials.createIdentity();
  rsk.did = `did:ethr:rsk:${rsk.did}`;
  const lacchain = Credentials.createIdentity();
  lacchain.did = `did:ethr:lacchain:${lacchain.did}`;
  const bfa = Credentials.createIdentity();
  bfa.did = `did:ethr:bfa:${bfa.did}`;

  await addIssuer(rsk.did, `Test: ${rsk.did}`, 'Issuer description');
  await addIssuer(lacchain.did, `Test: ${lacchain.did}`, 'Issuer description');
  // await addIssuer(bfa.did, `Test: ${bfa.did}`);
  return { rsk, lacchain, bfa };
};

module.exports = {
  addIssuers,
};
