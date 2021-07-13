const { addIssuer } = require('../../../services/IssuerService');
const { data } = require('./constant');

const addIssuers = async () => {
  await addIssuer(data.issuerDIDRsk, 'blockchain-rsk-test');
  await addIssuer(data.issuerDIDLatch, 'blockchain-latch--test');
  // await addIssuer(data.issuerDIDBfa, 'blockchain-bfa--test');
  return 'succes';
};

module.exports = {
  addIssuers,
};
