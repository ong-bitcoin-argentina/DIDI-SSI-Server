const Messages = require('../../../constants/Messages');
const { createCertificate } = require('../../../services/CertService');

const data = {
  did: 'did:ethr:0xc54e8f526c2880ef454ee9552ee5f60a89f1820e',
  invalidDid: 'didethr0xc54e8f526c2880ef454ee9552ee5f60a89f1820e',
  hash: '77631e3a5adef9730f3ea7ed42101be56d28604ccee951e6221b112985a2d440',
  jwt: 'asdasd',
};

const tokenData = {
  iat: 1624978767,
  issuer: 'did:ethr:0xb1ba86face5115be2ca902fae14f79de31c0fe7f',
};
const createData = async () => {
  const result = await createCertificate(data.did, { subject: '' }, undefined, Messages.CERTIFICATE.ERR.CREATE);
  return result;
};
const cert = createData();

module.exports = {
  cert,
  tokenData,
  data,
};
