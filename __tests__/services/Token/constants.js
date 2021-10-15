const BlockchainService = require('../../../services/BlockchainService');
const Constants = require('../../../constants/Constants');

const dataResponse = {
  sub: 'did:ethr:0x341b73c4dab6da7a2b037ae16e6a1f03d1245e99',
  issuer: `did:ethr:${Constants.SERVER_DID}`,
};

const createToken = async (key) => {
  const issuerDID = dataResponse.issuer;
  const privateKey = key;
  const jwt = await BlockchainService.createJWT(issuerDID, privateKey, { hola: 'test' });
  return jwt;
};

const token = createToken(Constants.SERVER_PRIVATE_KEY);
const invalidToken = createToken('6553d6a56762fd5072065c68b145b7b024e302015821bd10e416e01a3a99a47d');

module.exports = {
  token,
  invalidToken,
  dataResponse,
  error: {
    code: 'INVALID_TOKEN',
    message: 'El token de aplicación es inválido, por favor verificalo.',
  },
};
